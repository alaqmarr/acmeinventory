import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/users") || 
        req.nextUrl.pathname.startsWith("/export") ||
        req.nextUrl.pathname.startsWith("/products") ||
        req.nextUrl.pathname.startsWith("/analytics") ||
        req.nextUrl.pathname.startsWith("/reports") ||
        req.nextUrl.pathname.startsWith("/ledger")) {
      
      if (req.nextauth.token?.role !== "SUPERADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
    return NextResponse.next();
  },
  {
    callbacks: { authorized: ({ token }) => !!token },
    pages: { signIn: "/login" },
  },
);
export const config = {
  matcher: [
    "/((?!upgrade|login|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
