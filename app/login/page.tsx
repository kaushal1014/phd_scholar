'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type FormData = {
  email: string;
  password: string;
};

const notifyErr = (msg: string) => toast.error(msg);
const notifySucc = (msg: string) => toast.success(msg);

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const router = useRouter();  // Use router from 'next/navigation'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (response?.status === 200) {
        notifySucc('Login successful');
        setTimeout(() => {
          router.push('/dashboard');  // Redirect after a brief delay
      }, 1500);
      } else {
        notifyErr('Invalid credentials');
      }
    } catch (err) {
      notifyErr('Something went wrong');
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4">
      <ToastContainer />
      <Card className="w-full max-w-md bg-white shadow-lg border-2 border-gray-200 rounded-xl overflow-hidden">
        <CardHeader className="space-y-1 bg-gradient-to-b from-white to-gray-50 border-b-2 border-gray-200 p-6">
          <CardTitle className="text-2xl font-bold text-center text-gray-800">Login</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                name="email"
                onChange={handleChange}
                type="email"
                placeholder="m@example.com"
                required
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
              Sign In
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm bg-gradient-to-t from-white to-gray-50 border-t-2 border-gray-200 p-6">
          <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out">
            Forgot your password?
          </Link>
          <div className="text-gray-600">
            Don't have an account?{" "}
            <Link href="/signUp" className="font-semibold text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
