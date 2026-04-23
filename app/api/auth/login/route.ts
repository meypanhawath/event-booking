import { NextRequest, NextResponse } from 'next/server'
import { buildApiUrl } from '@/lib/api-url'

export async function POST(req: NextRequest) {
  try {
    const loginData = await req.json()

    const apiBody = {
      emailOrUsername: loginData.emailOrUsername || loginData.loginId || loginData.email,
      password: loginData.password,
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API

    if (!apiBaseUrl) {
      return NextResponse.json(
        { message: 'NEXT_PUBLIC_API is not configured' },
        { status: 500 }
      )
    }

    const res = await fetch(buildApiUrl(apiBaseUrl, '/auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(apiBody),
    })

    if (!res.ok) {
      const errorText = await res.text()
      return NextResponse.json(
        { message: 'Invalid credentials', details: errorText },
        { status: res.status }
      )
    }

    const data = await res.json()
    let user = null

    if (data.accessToken) {
      const meRes = await fetch(buildApiUrl(apiBaseUrl, '/auth/me'), {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
          Accept: 'application/json',
        },
      })

      if (meRes.ok) {
        user = await meRes.json()
      }
    }

    const response = NextResponse.json({
      ...data,
      user,
    })
    
    // Store accessToken in cookie
    response.cookies.set({
      name: 'token',
      value: data.accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
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
