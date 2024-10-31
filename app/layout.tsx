"use client"

import localFont from "next/font/local"
import "./globals.css"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useTheme } from "next-themes"
import { AuthProvider } from "./Providers";

// Load local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

// Header component
function Header() {
  const pathname = usePathname()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <nav className="flex items-center space-x-6 sm:space-x-8">
              <Link 
                href="/" 
                className={`text-xl font-semibold transition-colors duration-200 hover:text-primary ${pathname === "/" ? "text-primary" : "text-foreground"}`}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className={`text-xl transition-colors duration-200 hover:text-primary ${pathname === "/about" ? "text-primary" : "text-foreground"}`}
              >
                About
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="lg"
              className="text-lg hover:bg-primary/10"
              asChild
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button 
              size="lg"
              className="text-lg"
              asChild
            >
              <Link href="/signup">Sign Up</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

// Theme toggle button component
function ThemeToggle() {
  const { setTheme, theme } = useTheme()

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
  )
}

// Main layout component
export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode
  session: any // Adjust this type according to your session object structure
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
            <main>{children}</main>
            <ToastContainer />
          </ThemeProvider>
          </AuthProvider>
        </body>
      </html>
  )
}
