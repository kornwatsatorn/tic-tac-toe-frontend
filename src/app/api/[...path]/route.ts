import { NextRequest, NextResponse } from "next/server"
import getConfig from "next/config"
import axios from "axios"
import { getToken } from "next-auth/jwt"
import { EFetchApiMethod } from "@/utils/enum"
import fs from "fs"
import path from "path"

const { serverRuntimeConfig } = getConfig()

export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const pathSegments = url.pathname.split("/").filter(Boolean)
  const dynamicPath = pathSegments.join("/")
  const queryParams = new URLSearchParams(url.search).toString()
  const _apiEndpoint = `${serverRuntimeConfig.apiBaseUrl}/${dynamicPath}${
    queryParams ? `?${queryParams}` : ""
  }`

  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const _headers: any = {}

  const _isFormData =
    req.headers.get("content-type")?.includes("multipart/form-data") ?? false

  let method = EFetchApiMethod.POST
  let data = {}
  if (!_isFormData) {
    const _reqJson = await req.json()
    data = _reqJson.data

    _headers["Accept"] = "application/json"
    _headers["Content-Type"] = "application/json"
  } else {
    _headers["Content-Type"] = "multipart/form-data"
  }

  try {
    if (token) {
      _headers.Authorization = `Bearer ${token?.accessToken}`
    }

    let responseData: any
    if (_isFormData) {
      const formData = await req.formData()
      responseData = await axios.post(_apiEndpoint, formData, {
        headers: _headers,
      })
    } else {
      responseData = await axios.post(_apiEndpoint, data, {
        headers: _headers,
      })
    }

    if (process.env.NODE_ENV !== "production") {
      logRequest(
        req,
        _apiEndpoint,
        method,
        _headers,
        data,
        responseData.status,
        responseData.data
      )
    }
    return NextResponse.json(
      {
        statusCode: responseData?.status,
        message: responseData?.statusText,
        data: responseData?.data,
      },
      { status: responseData?.status }
    )
  } catch (error: any) {
    const _messageError =
      error.response?.data?.message ?? error.response?.statusText ?? error.code

    if (process.env.NODE_ENV !== "production") {
      logRequest(
        req,
        _apiEndpoint,
        method,
        _headers,
        data,
        error.response?.status ?? 500,
        _messageError
      )
      console.log(
        `%csrc/app/api/[...path]/route.ts:50 code [${error.response?.status}] message : ${_messageError}`
      )
    }

    return NextResponse.json(
      {
        error: _messageError,
      },
      { status: error.response?.status ?? 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const pathSegments = url.pathname.split("/").filter(Boolean)
  const dynamicPath = pathSegments.join("/")
  const queryParams = new URLSearchParams(url.search).toString()
  const _apiEndpoint = `${serverRuntimeConfig.apiBaseUrl}/${dynamicPath}${
    queryParams ? `?${queryParams}` : ""
  }`

  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const _headers: any = {}
  _headers["Accept"] = "application/json"
  _headers["Content-Type"] = "application/json"

  try {
    if (token) {
      _headers.Authorization = `Bearer ${token?.accessToken}`
    }

    const responseData = await axios.get(_apiEndpoint, {
      headers: _headers,
    })

    if (process.env.NODE_ENV !== "production") {
      logRequest(
        req,
        _apiEndpoint,
        EFetchApiMethod.GET,
        _headers,
        queryParams,
        responseData.status,
        responseData.data
      )
    }
    return NextResponse.json(
      {
        statusCode: responseData?.status,
        message: responseData?.statusText,
        data: responseData?.data,
      },
      { status: responseData?.status }
    )
  } catch (error: any) {
    const _messageError =
      error.response?.data?.message ?? error.response?.statusText ?? error.code

    if (process.env.NODE_ENV !== "production") {
      logRequest(
        req,
        _apiEndpoint,
        EFetchApiMethod.GET,
        _headers,
        queryParams,
        error.response?.status ?? 500,
        _messageError
      )
      console.log(
        `%csrc/app/api/[...path]/route.ts:50 code [${error.response?.status}] message : ${_messageError}`
      )
    }

    return NextResponse.json(
      {
        error: _messageError,
      },
      { status: error.response?.status ?? 500 }
    )
  }
}

function logRequest(
  req: NextRequest,
  endpoint: string,
  method: EFetchApiMethod,
  headers: any,
  requestData: any,
  responseStatus: number,
  responseData: any
) {
  const date = new Date()
  const logFileName = `api-log-${date.toISOString().split("T")[0]}.log` // Log file named with the current date
  const logFilePath = path.join(process.cwd(), "logs", logFileName)

  const logEntry = `
  ------------------------------
  Date: ${date.toISOString()}
  Method: ${method}
  Path: ${req.url}
  API Endpoint: ${endpoint}
  Request Headers: ${JSON.stringify(headers)}
  Request Body: ${requestData}
  Response Status: ${responseStatus}
  Response Body: ${JSON.stringify(responseData)}
  ------------------------------
  `

  // Ensure the logs directory exists
  if (!fs.existsSync(path.join(process.cwd(), "logs"))) {
    fs.mkdirSync(path.join(process.cwd(), "logs"))
  }

  // Append the log entry to the log file
  fs.appendFileSync(logFilePath, logEntry, "utf8")
}
