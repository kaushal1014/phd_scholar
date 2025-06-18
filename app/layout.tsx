import localFont from "next/font/local"
import "./globals.css"
import { AuthProvider } from "./Providers"
import Header from "@/components/Header"
import { ToastContainer, toast } from 'react-toastify';

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
          <ToastContainer />
          <Header />
          <main className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">{children}</main>
          <footer className="w-full bg-gradient-to-r from-[#1B3668] via-[#0A2240] to-[#1B3668] text-white py-8 sm:py-16 mt-12 sm:mt-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c')] opacity-5 bg-cover bg-center mix-blend-overlay" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
              <p className="text-gray-200 text-base sm:text-lg font-medium">
                © {new Date().getFullYear()} PES University Research Degree Program. All rights reserved.
              </p>
              <p className="text-gray-400 mt-2 text-sm sm:text-base font-light">
                Nurturing Tomorrow's Researchers Today
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
