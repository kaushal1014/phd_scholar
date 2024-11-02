"use client";

import localFont from "next/font/local";
import "./globals.css";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from "next-themes";
import { AuthProvider } from "./Providers";
import { useSession, signOut } from "next-auth/react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      toast.error("Error signing out.");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
          <GraduationCap className="h-10 w-10 text-blue-600 dark:text-blue-400 mr-3" />
            <span className="text-2xl font-bold text-foreground">PhD Scholar Portal</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/dashboard" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/publications"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/publications" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Publications
            </Link>
            <Link
              href="/milestones"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/milestones" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Milestones
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {!session ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm hover:bg-primary/10"
                  asChild
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  size="sm"
                  className="text-sm"
                  asChild
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-sm"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full"
    >
      <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: any;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <footer className="bg-white dark:bg-gray-800">
              <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center space-x-6 md:order-2">
                  <Link href="/about" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                    About
                  </Link>
                  <Link href="/contact" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                    Contact
                  </Link>
                  <Link href="/privacy" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                    Privacy Policy
                  </Link>
                </div>
                <div className="mt-8 md:mt-0 md:order-1">
                  <p className="text-center text-base text-gray-400">&copy; 2024 PhD Scholar Portal. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}