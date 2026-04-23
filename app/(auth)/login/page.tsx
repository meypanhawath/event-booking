'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Lock, ArrowRight, User } from 'lucide-react'
import { toast } from 'sonner'

import { useLoginMutation } from '@/lib/features/auth/authApi'
import { setCredentials } from '@/lib/features/auth/authSlice'
import { useAppDispatch } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getDashboardPath } from '@/lib/auth-utils'
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons'

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [login, { isLoading }] = useLoginMutation()
  
  const [formData, setFormData] = useState({
    emailOrUsername: '', // Can be email OR username
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.emailOrUsername || !formData.password) {
      toast.error('Please fill in all fields', {
        position: 'top-right',
      })
      return
    }

    try {
      const result = await login({
        emailOrUsername: formData.emailOrUsername,
        password: formData.password,
      }).unwrap()

      dispatch(setCredentials({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      }))

      toast.success('Welcome back!', {
        description: 'You have successfully logged in.',
        position: 'top-right',
      })

      router.replace(getDashboardPath(result.user?.roles ?? result.roles))
      router.refresh()
    } catch (error: unknown) {
      const errorWithData = error as { data?: { message?: string } }
      const message = errorWithData?.data?.message || 'Invalid email/username or password'
      toast.error('Login failed', {
        description: message,
        position: 'top-right',
      })
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Sign in with your email or username
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <SocialAuthButtons />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Or continue with password</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Email or Username */}
          <div className="space-y-2">
            <Label htmlFor="emailOrUsername" className="text-foreground">
              Email or Username
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="emailOrUsername"
                type="text"
                placeholder="email or username"
                value={formData.emailOrUsername}
                onChange={(e) => setFormData({ ...formData, emailOrUsername: e.target.value })}
                className="pl-10 h-12 bg-background border-border focus:border-[#C14FE6] focus:ring-[#C14FE6]/20"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 pr-10 h-12 bg-background border-border focus:border-[#C14FE6] focus:ring-[#C14FE6]/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-[#C14FE6] hover:text-[#C14FE6]/80 transition"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#C14FE6] hover:bg-[#C14FE6]/90 text-white font-medium rounded-xl transition-all"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin size-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign in
                <ArrowRight className="size-4" />
              </span>
            )}
          </Button>
        </form>

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-[#C14FE6] hover:text-[#C14FE6]/80 font-medium transition"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
