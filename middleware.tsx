import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Skip middleware for API routes that handle file uploads
  if (request.nextUrl.pathname.startsWith("/api/user/phd-scholar/course-certificate")) {
    return NextResponse.next()
  }

  // Continue with other middleware logic
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/user/phd-scholar/course-certificate (API routes for file uploads)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/user/phd-scholar/course-certificate|_next/static|_next/image|favicon.ico).*)",
  ],
}

