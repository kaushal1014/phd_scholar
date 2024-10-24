'use client';
import { useState } from 'react';
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
  firstName: string;
  middleName: string;
  lastName: string;
  password: string;
}

const notifyErr = (msg: string) => toast.error(msg);
const notifySucc = (msg: string) => toast.success(msg);

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('api/userSignUp', formData);
      if (response.status === 200) {
        notifySucc('Account created successfully');
      } else {
        notifyErr('Something went wrong');
      }
    } catch (err) {
      notifyErr('Something went wrong');
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4">
      <Card className="w-full max-w-md bg-white shadow-lg border-2 border-gray-200 rounded-xl overflow-hidden">
        <CardHeader className="space-y-1 bg-gradient-to-b from-white to-gray-50 border-b-2 border-gray-200 p-6">
          <CardTitle className="text-2xl font-bold text-center text-gray-800">Sign Up</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
                <Input 
                  id="firstName"
                  name="firstName" // Add name attribute
                  placeholder="John"
                  onChange={handleChange}
                  required 
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
                <Input 
                  id="lastName"
                  name="lastName" // Add name attribute
                  placeholder="Doe"
                  onChange={handleChange}
                  required 
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName" className="text-sm font-medium text-gray-700">Middle Name (Optional)</Label>
              <Input 
                id="middleName"
                name="middleName" // Add name attribute
                placeholder="Middle Name"
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input 
                id="email"
                name="email" // Add name attribute
                type="email"
                placeholder="john@example.com"
                onChange={handleChange}
                required 
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <div className="relative">
                <Input 
                  id="password"
                  name="password" // Add name attribute
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
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
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
              Create Account
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex justify-center text-sm bg-gradient-to-t from-white to-gray-50 border-t-2 border-gray-200 p-6">
          <div className="text-gray-600">
            Already have an account?{" "}
            <Link href="/userLogin" className="font-semibold text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
      <ToastContainer />
    </div>
  );
}
