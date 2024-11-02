'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from "next-auth/react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type FormData = {
  email: string
  password: string
}

const notifyErr = (msg: string) => toast.error(msg)
const notifySucc = (msg: string) => toast.success(msg)

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' })
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })
      if (response?.status === 200) {
        notifySucc('Login successful')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } else {
        notifyErr('Invalid credentials')
      }
    } catch (err) {
      notifyErr('Something went wrong')
    }
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/80 p-4 transition-colors duration-300">
      <ToastContainer />
      <div className="w-full max-w-md -mt-20">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    onChange={handleChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex flex-col space-y-2 text-center text-sm">
            <Link 
              href="/forgot-password" 
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Forgot your password?
            </Link>
            <div className="text-muted-foreground">
              Don't have an account?{" "}
              <Link 
                href="/signup" 
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}