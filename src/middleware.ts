// middleware.ts
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  // If the user is authenticated and trying to access the login,register page, redirect to the home
  const _nextUrl = request.nextUrl.pathname
  const _checkPageNext = ["/login", "/register"].includes(_nextUrl)

  if (token && _checkPageNext) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Check if the token is valid
  if (!token && !_checkPageNext) {
    // Redirect to the login page if not authenticated
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Continue to the requested page if the conditions are not met
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    // auth
    "/login",
    "/register",
  ],
}
