import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const hiddenRoutes = ["/hire-me"]

export function middleware(request: NextRequest) {
  if (hiddenRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/hire-me/:path*"],
}
