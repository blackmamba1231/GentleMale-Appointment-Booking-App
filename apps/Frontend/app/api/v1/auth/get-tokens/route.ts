import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get("refreshToken")
    const sessionId = cookieStore.get("sessionId")
    if(!refreshToken || !sessionId){
        throw new Error('Session not Found');
    }
    return NextResponse.json({ refreshToken, sessionId })
  } catch (error) {
    return NextResponse.json({ error: "Failed to set tokens" }, { status: 500 })
  }
}
