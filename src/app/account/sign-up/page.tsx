'use client'

import React, { useState, FormEvent } from 'react'
import { signUp } from '@/lib/actions'
import GoogleButton from '@/components/auth/google-button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const nav = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!username.trim() || !email.trim() || !password) {
      setMessage('Please fill out all fields.')
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMessage('Please enter a valid email.')
      return
    }

    setLoading(true)
    try {
      const res = await signUp({ name: username, email, password })

      if (res?.status) {
        toast.success(res?.message,{
          description:res?.desc
        })
       nav.push(`/account/verification-email?email=${encodeURIComponent(String(res.email))}`);

      }else{
        toast.error(res.message || "Sign up failed.")
      }
    } catch {
      setMessage('Sign up failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex items-center flex-col justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Sign up to get started with your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <GoogleButton label="Sign up with Google" />

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="yourname"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {message && (
              <div
                className={`flex items-center gap-2 text-sm p-2 rounded-md ${
                  message.toLowerCase().includes('success')
                    ? 'text-green-600 bg-green-50'
                    : 'text-red-600 bg-red-50'
                }`}
              >
                {message.toLowerCase().includes('success') ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{message}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing up…' : 'Sign Up'}
            </Button>

            <div className='mt-2 flex items-center justify-center'>
                <p>Already have an account?</p>
                <Link href={"/account/sign-in"}>sign-in</Link>
            </div>

          </form>
        </CardContent>
      </Card>

    </main>
  )
}
