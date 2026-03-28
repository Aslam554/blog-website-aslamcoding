export { auth as middleware } from "@/auth"

export const config = {
  matcher: [
    // Only run auth middleware on dashboard routes (protected pages)
    '/dashboard/:path*',
  ],
}