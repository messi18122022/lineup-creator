import { createClient } from "@/lib/supabase/browser";
import { CustomMode, CustomFormation } from "@/types";
import { ModeOverrides, FormationOverrides } from "@/lib/customModes";

export interface UserData {
  custom_modes: CustomMode[];
  extra_formations: Record<string, CustomFormation[]>;
  mode_overrides: ModeOverrides;
  formation_overrides: FormationOverrides;
}

export async function loadUserData(userId: string): Promise<UserData | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_data")
    .select("custom_modes, extra_formations, mode_overrides, formation_overrides")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return data as UserData;
}

export async function saveUserData(userId: string, data: UserData): Promise<void> {
  const supabase = createClient();
  await supabase.from("user_data").upsert({
    user_id: userId,
    custom_modes: data.custom_modes,
    extra_formations: data.extra_formations,
    mode_overrides: data.mode_overrides,
    formation_overrides: data.formation_overrides,
    updated_at: new Date().toISOString(),
  });
}
