import { type NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic"; // prevent prerender

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.headers.get("Authorization")?.split(" ")[1];

    if (!accessToken) {
      return NextResponse.json(
        { error: "Missing access token" },
        { status: 401 }
      );
    }
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "/api/v1/auth/me",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return NextResponse.json(response.data, { status: response.status });

  } catch (error: any) {
    console.error("catch triggered");

      return NextResponse.json(
        error.response.data?.message ,
        { status: error.response.status || 500 }
      );
   
  }
}
