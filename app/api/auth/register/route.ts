import { NextRequest, NextResponse } from "next/server"
import { buildApiUrl } from "@/lib/api-url"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const apiBaseUrl = process.env.NEXT_PUBLIC_API

    if (!apiBaseUrl) {
      return NextResponse.json(
        { message: "NEXT_PUBLIC_API is not configured" },
        { status: 500 }
      )
    }

    const res = await fetch(buildApiUrl(apiBaseUrl, "/auth/register"), {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        username: body.username,
        email: body.email,
        phoneNumber: body.phoneNumber,
        password: body.password,
        confirmPassword: body.confirmPassword,
      })
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: "Registration failed" }))
      return NextResponse.json(
        { message: errorData.message || "Registration failed" }, 
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json(
      { message: "Internal Error" }, 
      { status: 500 }
    )
  }
}
