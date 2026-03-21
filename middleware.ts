import { NextResponse, type NextRequest } from "next/server";

// Middleware is intentionally minimal — no server-side session validation
// to avoid session corruption with Supabase publishable key format.
// Route protection is handled client-side.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
