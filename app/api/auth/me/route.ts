import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { buildApiUrl } from '@/lib/api-url'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return NextResponse.json({ message: 'No session' }, { status: 401 })
  }

  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API

    if (!apiBaseUrl) {
      return NextResponse.json(
        { message: 'NEXT_PUBLIC_API is not configured' },
        { status: 500 }
      )
    }

    const res = await fetch(buildApiUrl(apiBaseUrl, '/auth/me'), {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    if (!res.ok) throw new Error('Invalid token')

    const user = await res.json()
    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ message: 'Invalid session' }, { status: 401 })
  }
}
