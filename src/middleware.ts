import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
export default withAuth(
  function middleware(req) {
    return;
  },
  {
    callbacks: { authorized: ({ token }) => !!token },
    pages: { signIn: "/login" },
  },
);
export const config = {
  matcher: [
    "/((?!setup|login|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
