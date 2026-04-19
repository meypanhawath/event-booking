import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value
  
  if (!token) {
    return NextResponse.json({ message: 'No session' }, { status: 401 })
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    
    if (!res.ok) throw new Error('Invalid token')
    
    const user = await res.json()
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ message: 'Invalid session' }, { status: 401 })
  }
}