import { createClient } from "@/lib/supabase/server";
import HomeClientDynamic from "@/components/HomeClientDynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <HomeClientDynamic userEmail={user?.email ?? null} isPro={false} />;
}
