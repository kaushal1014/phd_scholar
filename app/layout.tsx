"use client"

import localFont from "next/font/local"
import "./globals.css"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Moon, Sun, GraduationCap, User, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useTheme } from "next-themes"
import { AuthProvider } from "./Providers"
import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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

function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false })
      toast.success("Signed out successfully")

      if (pathname === "/dashboard") {
        router.push("/login")
      }
    } catch (error) {
      toast.error("Error signing out. Please try again.")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center gap-4">
              <Image src="/logoPesu.png" alt="PES University Logo" width={50} height={50} className="h-12 w-auto" />
              <span className="text-2xl font-bold text-foreground">PhD Scholar Portal</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-10">
            <Link
              href="/"
              className={`text-lg font-medium transition-colors hover:text-primary ${
                pathname === "/" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Home
            </Link>
            <Link
              href="/programs"
              className={`text-lg font-medium transition-colors hover:text-primary flex items-center ${
                pathname.startsWith("/programs") ? "text-primary" : "text-foreground/60"
              }`}
            >
              Programs
            </Link>
            <Link
              href="/milestones"
              className={`text-lg font-medium transition-colors hover:text-primary ${
                pathname === "/milestones" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Milestones
            </Link>
            <Link
              href="/resources"
              className={`text-lg font-medium transition-colors hover:text-primary ${
                pathname === "/resources" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Resources
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {!session ? (
              <>
                <Button variant="ghost" size="sm" className="text-base hover:bg-primary/10" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" className="text-base" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/avatar.png" alt={session.user?.name || "User avatar"} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/myprofile/`}>Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}


export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode
  session: any
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <AuthProvider>
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <footer className="bg-secondary">
              <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center lg:px-8">
                <div className="flex justify-center space-x-6 md:order-2">
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </div>
                <div className="mt-8 md:mt-0 md:order-1">
                  <p className="text-center text-sm text-muted-foreground">
                    &copy; 2024 PhD Scholar Portal. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
        </AuthProvider>
      </body>
    </html>
  )
}

