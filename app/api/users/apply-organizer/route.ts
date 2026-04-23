import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { buildApiUrl } from '@/lib/api-url'

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    
    const backendUrl = process.env.NEXT_PUBLIC_API || 'http://localhost:8000'
    
    const res = await fetch(buildApiUrl(backendUrl, '/users/apply-organizer'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    const data = await res.text()
    
    return new NextResponse(data, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('Content-Type') || 'application/json',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Proxy error', error: String(error) },
      { status: 500 }
    )
  }
}
