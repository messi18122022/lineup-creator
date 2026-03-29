import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import HomeClientDynamic from "@/components/HomeClientDynamic";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isPro = false;
  if (user) {
    const admin = createAdminClient();
    const { data } = await admin
      .from("profiles")
      .select("is_pro")
      .eq("user_id", user.id)
      .single();
    isPro = data?.is_pro ?? false;
  }

  return <HomeClientDynamic userEmail={user?.email ?? null} isPro={isPro} userId={user?.id ?? null} />;
}
