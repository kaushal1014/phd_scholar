"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type FormData = {
  email: string
  password: string
}

type ForgotPasswordFormData = {
  email: string
}

const notifyErr = (msg: string) => toast.error(msg, {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  style: {
    background: '#fff',
    color: '#dc2626',
    border: '1px solid #dc2626',
  },
})

const notifySucc = (msg: string) => toast.success(msg, {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
})

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const { data: session, status } = useSession()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

  const {
    register: registerForgotPassword,
    handleSubmit: handleSubmitForgotPassword,
    formState: { errors: forgotPasswordErrors },
    reset: resetForgotPasswordForm,
  } = useForm<ForgotPasswordFormData>()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const onSubmit = async (data: FormData) => {
    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      if (response?.ok) {
        notifySucc("Login successful")
        // Get the user's role from the session
        const userResponse = await fetch('/api/user/me')
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data")
        }
        const userData = await userResponse.json()
        
        // Redirect based on user role
        if (userData.isSupervisor) {
          router.push("/supervisor")
        } else if (userData.isAdmin) {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      } else {
        if (response?.error === "Wrong Password") {
          notifyErr("Incorrect password. Please try again.")
        } else if (response?.error === "Wrong Email") {
          notifyErr("No account found with this email.")
        } else {
          notifyErr("Invalid credentials")
        }
      }
    } catch (err) {
      console.error("Login error:", err)
      notifyErr("Something went wrong")
    }
  }

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    try {
      setIsResettingPassword(true)

      // Simulate API call to send reset password email
      const response = await axios.post("api/reset-password", { email: data.email })

      notifySucc(`Password reset link sent to ${data.email}`)
      setForgotPasswordOpen(false)
      resetForgotPasswordForm()
    } catch (error) {
      notifyErr("Failed to send reset link. Please try again.")
    } finally {
      setIsResettingPassword(false)
    }
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  if (!isClient || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f7fa]">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-[#0a2158] border-t-transparent rounded-full animate-spin" />
          <span className="text-[#0a2158]">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Left side - Login form */}
      <div className="w-full lg:w-1/2 flex items-start justify-center p-2 sm:p-4 lg:p-8 bg-[#f5f7fa]">
        <div className="w-full max-w-md mt-8">
          <div className="mb-8 sm:mb-12">
            <Image src="/logoPesu.png" alt="PES University Logo" width={240} height={80} className="mb-6 sm:mb-8" />
            <h1 className="text-2xl sm:text-4xl font-light text-gray-800">Sign in</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Input
                  id="email"
                  placeholder="Email"
                  className="h-10 sm:h-12 bg-white border-gray-200 rounded-md text-sm sm:text-base"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="h-10 sm:h-12 bg-white border-gray-200 rounded-md pr-10 text-sm sm:text-base"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500"
                    onClick={togglePasswordVisibility}
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-red-500 text-xs sm:text-sm">{errors.password.message}</p>}
              </div>

              <Button
                type="submit"
                className="w-full h-10 sm:h-12 bg-[#0a2158] hover:bg-[#0a2158]/90 transition-colors rounded-md text-sm sm:text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="text-center mt-6 sm:mt-8">
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-[#2563eb] hover:underline text-xs sm:text-sm"
                >
                  Forgot your Password?
                </button>
                <br></br>
                <button
                  type="button"
                  onClick={() => router.push('/signup')}
                  className="text-[#2563eb] hover:underline text-xs sm:text-sm"
                >
                  Create an account?
                </button>
              </div>
              
            </div>
          </form>

          <div className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-gray-500">
            <p>Copyright © PES University, Bengaluru, India.</p>
          </div>
        </div>
      </div>

      {/* Right side - PhD Benefits panel */}
      <div className="hidden lg:block lg:w-1/2 bg-[#0a2158] text-white p-8">
        <div className="h-full flex flex-col justify-center items-center">
          <div className="w-full max-w-md space-y-8">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-semibold mb-2">PhD Research Portal</h2>
              <p className="text-white/80">Access exclusive resources for doctoral researchers</p>
            </div>

            <div className="bg-[#0a2158]/30 border border-[#ffffff20] rounded-lg p-6 hover:bg-[#0a2158]/40 transition-colors">
              <div className="flex items-start gap-5">
                <div className="bg-[#1a3a7a] p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M9 9h6" />
                    <path d="M9 13h6" />
                    <path d="M9 17h6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium mb-1">Research Dashboard</h3>
                  <p className="text-white/80 mb-3">
                    Track your publications, citations, and research progress in real-time
                  </p>
                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="mt-2 bg-[#1a3a7a] hover:bg-[#1a3a7a]/80 text-white border border-[#ffffff30]"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-[#0a2158]/30 border border-[#ffffff20] rounded-lg p-6 hover:bg-[#0a2158]/40 transition-colors">
              <div className="flex items-start gap-5">
                <div className="bg-[#1a3a7a] p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M17 12c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4Z" />
                    <path d="M5 5a4 4 0 0 1 4 4" />
                    <path d="M19 5a4 4 0 0 0-4 4" />
                    <path d="M5 19a4 4 0 0 0 4-4" />
                    <path d="M19 19a4 4 0 0 1-4-4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium mb-1">Collaboration Hub</h3>
                  <p className="text-white/80 mb-3">
                    Connect with peers, share resources, and participate in discussions
                  </p>
                  <Button
                    onClick={() => router.push("/collaborations")}
                    className="mt-2 bg-[#1a3a7a] hover:bg-[#1a3a7a]/80 text-white border border-[#ffffff30]"
                  >
                    View Collaborations
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-[#0a2158]/30 border border-[#ffffff20] rounded-lg p-6 hover:bg-[#0a2158]/40 transition-colors">
              <div className="flex items-start gap-5">
                <div className="bg-[#1a3a7a] p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <line x1="3" x2="21" y1="9" y2="9" />
                    <line x1="9" x2="9" y1="21" y2="9" />
                    <line x1="15" x2="15" y1="21" y2="9" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium mb-1">Events & Meetings</h3>
                  <p className="text-white/80 mb-3">
                    Stay updated with monthly seminars, conferences, and research meetings
                  </p>
                  <Button
                    onClick={() => router.push("/events")}
                    className="mt-2 bg-[#1a3a7a] hover:bg-[#1a3a7a]/80 text-white border border-[#ffffff30]"
                  >
                    View Events
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-8 text-center">
              <p className="text-white/70">Part of PES University Research Excellence Initiative</p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitForgotPassword(handleForgotPassword)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  placeholder="m@pesu.edu"
                  {...registerForgotPassword("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  disabled={isResettingPassword}
                />
                {forgotPasswordErrors.email && (
                  <p className="text-red-500 text-sm">{forgotPasswordErrors.email.message}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setForgotPasswordOpen(false)}
                disabled={isResettingPassword}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isResettingPassword} className="bg-[#0a2158] hover:bg-[#0a2158]/90">
                {isResettingPassword ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
