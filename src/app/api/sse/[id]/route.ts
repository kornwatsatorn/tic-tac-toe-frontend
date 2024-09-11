import { getToken } from "next-auth/jwt"
import getConfig from "next/config"
import { NextRequest, NextResponse } from "next/server"
const { serverRuntimeConfig } = getConfig()
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const sseEndpoint = `${serverRuntimeConfig.apiBaseUrl}/api/sse/events/${id}`

  try {
    const token = await getToken({
      req: req,
      secret: process.env.NEXTAUTH_SECRET,
    })
    if (!token) {
      throw new Error("Not have token")
    }
    // Establish a connection to the external SSE endpoint
    const sseResponse = await fetch(sseEndpoint, {
      method: "GET",
      headers: {
        Accept: "text/event-stream",
        Authorization: `Bearer ${token?.accessToken}`,
      },
    })

    // Relay SSE events from the external endpoint to the client
    if (sseResponse.body) {
      const reader = sseResponse.body.getReader()
      const decoder = new TextDecoder() // Create a TextDecoder instance
      const stream = new ReadableStream({
        async start(controller) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              break
            }
            // Decode Uint8Array to a string and enqueue it
            const decodedValue = decoder.decode(value, { stream: true })
            controller.enqueue(decodedValue)
          }
          controller.close()
        },
      })

      return new NextResponse(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      })
    }
  } catch (error) {
    console.error("Error relaying SSE:", error)
    // Return a new response with an error message
    return new NextResponse(
      JSON.stringify({ error: "Error connecting to SSE." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }

  // Fallback if no SSE body is available
  return new NextResponse(JSON.stringify({ error: "No SSE body available." }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  })
}
