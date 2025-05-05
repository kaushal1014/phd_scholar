"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Moon, Sun, GraduationCap, User, ChevronDown, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleSignOut = async () => {
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: "/login"
      })
      router.push("/login")
    } catch (error) {
      console.log("signout error", error)
      router.push("/login") // Ensure redirect even if signOut fails
    }
  }

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className={`text-base sm:text-lg font-medium transition-colors hover:text-primary ${
        pathname === href ? "text-primary" : "text-foreground/60"
      }`}
      onClick={() => setIsMenuOpen(false)}
    >
      {children}
    </Link>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center gap-4 sm:gap-10">
              <Image src="/logoPesu.png" alt="PES University Logo" width={40} height={40} className="h-8 sm:h-12 w-auto" />
              <span className="text-xl sm:text-3xl font-bold text-foreground">PhD Scholar Portal</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full">
                <nav className="flex flex-col space-y-4 mt-8">
                  <NavLink href="/">Home</NavLink>
                  <NavLink href="/programs">Programs</NavLink>
                  <NavLink href="/research-support">Research Support</NavLink>
                  <NavLink href="/resources">Resources</NavLink>
                  <NavLink href="/events">Events</NavLink>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-10">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/programs">Programs</NavLink>
            <NavLink href="/research-support">Research Support</NavLink>
            <NavLink href="/resources">Resources</NavLink>
            <NavLink href="/events">Events</NavLink>
          </nav>

          <div className="flex items-center space-x-4">
            {!session ? (
              <Button size="sm" className="text-sm sm:text-base" asChild>
                <Link href="/login">Login</Link>
              </Button>
            ) : (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8 sm:h-12 sm:w-12">
                        <AvatarImage src="/avatar.png" alt={session.user?.name || "User avatar"} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={
                        session.user.isAdmin ? "/admin" :
                        session.user.isSupervisor ? "/supervisor" :
                        "/dashboard"
                      }>Dashboard</Link>
                    </DropdownMenuItem>
                    {session.user.isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin/create-supervisor">Create Supervisor</Link>
                      </DropdownMenuItem>
                    )}
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

export default Header 