import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const loginData = await req.json()
    console.log('Received login data:', loginData)

    // API expects emailOrUsername field
    const apiBody = {
      emailOrUsername: loginData.emailOrUsername || loginData.loginId || loginData.email,
      password: loginData.password,
    }

    console.log('Sending to API:', apiBody)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(apiBody),
    })

    console.log('API response status:', res.status)

    if (!res.ok) {
      const errorText = await res.text()
      console.error('API error response:', errorText)
      return NextResponse.json(
        { message: 'Invalid credentials', details: errorText },
        { status: res.status }
      )
    }

    const data = await res.json()
    console.log('Login success:', data)

    const response = NextResponse.json(data)
    
    response.cookies.set({
      name: 'token',
      value: data.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return response
  } catch (error) {
    console.error('Login route error:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    )
  }
}