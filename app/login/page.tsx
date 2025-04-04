"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Image from "next/image"
import Link from "next/link"

type FormData = {
  email: string;
  password: string;
};

const notifyErr = (msg: string) => toast.error(msg)
const notifySucc = (msg: string) => toast.success(msg)

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isClient, setIsClient] = useState(false); // Track if the component is running on the client
  const router = useRouter();
  const { data: session, status } = useSession();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (response?.ok) {
        notifySucc('Login successful');
        router.push('/dashboard');
      } else {
        notifyErr('Invalid credentials');
      }
    } catch (err) {
      notifyErr('Something went wrong');
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  if (!isClient || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/50">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-[#4C1D95] border-t-transparent rounded-full animate-spin" />
          <span className="text-[#1F2937]">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#f5f7fa]">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <Image
              src="/logoPesu.png"
              alt="PES University Logo"
              width={240}
              height={80}
              className="mb-8"
            />
            <h1 className="text-4xl font-light text-gray-800">Sign in</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div className="space-y-2">
              <Input
                  id="email"
                  placeholder="m@example.com"
                  className="focus:ring-[#4C1D95] focus:border-[#4C1D95]"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email format',
                    },
                  })}
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="h-12 bg-white border-gray-200 rounded-md pr-10"
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
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#0a2158] hover:bg-[#0a2158]/90 transition-colors rounded-md"
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

              <div className="h-4"></div>

              <div className="text-center mt-8">
                <p className="text-[#2563eb]">
                  Contact Admin for any issues.
                </p>
              </div>
            </div>
          </form>

          <div className="mt-12 text-center text-sm text-gray-500">
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M9 9h6" />
                    <path d="M9 13h6" />
                    <path d="M9 17h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-1">Research Dashboard</h3>
                  <p className="text-white/80">Track your publications, citations, and research progress in real-time</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#0a2158]/30 border border-[#ffffff20] rounded-lg p-6 hover:bg-[#0a2158]/40 transition-colors">
              <div className="flex items-start gap-5">
                <div className="bg-[#1a3a7a] p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M17 12c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4Z" />
                    <path d="M5 5a4 4 0 0 1 4 4" />
                    <path d="M19 5a4 4 0 0 0-4 4" />
                    <path d="M5 19a4 4 0 0 0 4-4" />
                    <path d="M19 19a4 4 0 0 1-4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-1">Collaboration Hub</h3>
                  <p className="text-white/80">Connect with peers, share resources, and participate in discussions</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#0a2158]/30 border border-[#ffffff20] rounded-lg p-6 hover:bg-[#0a2158]/40 transition-colors">
              <div className="flex items-start gap-5">
                <div className="bg-[#1a3a7a] p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <line x1="3" x2="21" y1="9" y2="9" />
                    <line x1="9" x2="9" y1="21" y2="9" />
                    <line x1="15" x2="15" y1="21" y2="9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-1">Events & Meetings</h3>
                  <p className="text-white/80">Stay updated with monthly seminars, conferences, and research meetings</p>
                </div>
              </div>
            </div>
            
            <div className="pt-8 text-center">
              <p className="text-white/70">Part of PES University Research Excellence Initiative</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
