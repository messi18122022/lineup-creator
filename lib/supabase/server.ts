import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              const { maxAge, expires, ...sessionOptions } = options ?? {};
              void maxAge; void expires;
              cookieStore.set(name, value, sessionOptions);
            });
          } catch {
            // Called from a Server Component — cookies can't be set, ignore
          }
        },
      },
    }
  );
}
