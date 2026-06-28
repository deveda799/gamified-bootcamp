import { redirect } from "next/navigation";
import { canAccessAdmin } from "@/lib/auth/roles";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("organization_members")
    .select("role")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin", "assistant"])
    .limit(1)
    .maybeSingle();

  if (!canAccessAdmin(data?.role)) {
    redirect("/app/home");
  }

  return user;
}
