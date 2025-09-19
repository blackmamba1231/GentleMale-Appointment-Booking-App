import axios from "axios";
import {type  NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try{
        const {email, otp} = await request.json();
        const res = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/api/v1/auth/verify",{
            email , otp
        });
        if(res.status !== 201){
            console.log(res.data.message)
            throw new Error(res.data.message)
        }
        return NextResponse.json(res.data)
    }catch(error: any){
        console.log("Error message",error.response.data.message)
        return NextResponse.json(error.response.data.message, {status: 500});
    }
}