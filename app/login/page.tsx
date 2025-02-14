'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type FormData = {
  email: string;
  password: string;
};

const notifyErr = (msg: string) => toast.error(msg);
const notifySucc = (msg: string) => toast.success(msg);

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

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

  if (status === "loading") {
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/50 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="shadow-lg border-[#E5E7EB] bg-white/95 backdrop-blur-sm hover:shadow-xl transition-shadow">
          <CardHeader className="space-y-2">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-[#4C1D95]/10 p-3">
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
                  className="h-8 w-8 text-[#4C1D95]"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-[#1F2937]">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-[#6B7280]">
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-[#1F2937]">Email</Label>
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

              <div className="space-y-3">
                <Label htmlFor="password" className="text-[#1F2937]">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="focus:ring-[#4C1D95] focus:border-[#4C1D95] pr-10"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters long',
                      }
                    })}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-[#6B7280]"
                    onClick={togglePasswordVisibility}
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#4C1D95] hover:bg-[#4C1D95]/90 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex flex-col space-y-3 text-center text-sm mt-4">
            <Link
              href="/forgot-password"
              className="text-sm text-[#6B7280] hover:text-[#4C1D95] transition-colors"
            >
              Forgot your password?
            </Link>
            <div className="text-[#6B7280]">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="font-medium text-[#4C1D95] hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}