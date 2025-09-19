import { type NextRequest, NextResponse } from "next/server"
import axios from "axios"
export async function POST(request: NextRequest) {
    try{
    const { name, email, phone, password } = await request.json()
    const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/api/v1/auth/register", {
        name, email, phone, password
    })
    if(response.status !== 201){
        console.log(response.data.message)
        throw new Error(response.data.message)
    }
    return NextResponse.json(response.data)
    }catch(error: any){
        console.log("catch triggered");
        console.log("Error messsage:", error.response.data.message);
        return NextResponse.json(error.response.data.message, {status: 500});
}
}
