'use client'

import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '@/lib/store'
import { setCredentials, logout, setLoading } from '@/lib/features/auth/authSlice'

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore>(undefined)
  
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Call your Railway API to check session
        const res = await fetch('/api/auth/me') // Your custom endpoint (see below)
        
        if (res.ok) {
          const user = await res.json()
          storeRef.current?.dispatch(setCredentials({
            accessToken: 'from-cookie',
            user,
          }))
        } else {
          storeRef.current?.dispatch(logout())
        }
      } catch (error) {
        storeRef.current?.dispatch(logout())
      } finally {
        storeRef.current?.dispatch(setLoading(false))
      }
    }

    checkAuth()
  }, [])

  return <Provider store={storeRef.current}>{children}</Provider>
}