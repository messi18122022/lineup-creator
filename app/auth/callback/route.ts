import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user?.email) {
      // Email is now confirmed. Sign out so the user goes through the normal login flow.
      await supabase.auth.signOut();
      return NextResponse.redirect(
        `${origin}/auth/confirmed?email=${encodeURIComponent(data.user.email)}`
      );
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=confirmation_failed`);
}
