import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get("refreshToken")?.value
    const sessionId = cookieStore.get("sessionId")?.value

    if (!refreshToken || !sessionId) {
      return NextResponse.json({ error: "No refresh token found" }, { status: 401 })
    }

    // Call backend refresh endpoint
    const response = await fetch(`${process.env.API_BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken, sessionId }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Token refresh failed" }, { status: 401 })
    }

    const data = await response.json()
    return NextResponse.json({ accessToken: data.accessToken })
  } catch (error) {
    return NextResponse.json({ error: "Token refresh failed" }, { status: 500 })
  }
}
