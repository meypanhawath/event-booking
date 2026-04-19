import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/register`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        username: body.username,
        email: body.email,
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