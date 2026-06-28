import type { SupabaseClient } from "@supabase/supabase-js";
import type { CheckInRepository } from "@/lib/application/ports/check-in-repository";

export function createSupabaseCheckInReadRepository(
  client: SupabaseClient
): CheckInRepository {
  return {
    async getMine(userId) {
      const { data: enrollment } = await client
        .from("enrollments")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "active")
        .limit(1)
        .maybeSingle<{ id: string }>();
      if (!enrollment) return [];
      const { data, error } = await client
        .from("check_ins")
        .select("id,local_date,note,created_at")
        .eq("enrollment_id", enrollment.id)
        .order("local_date", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []).map((row) => ({
        id: row.id,
        localDate: row.local_date,
        note: row.note,
        createdAt: row.created_at
      }));
    },
    async checkInToday(input) {
      const { data, error } = await client.rpc("check_in_today", {
        p_user_id: input.userId,
        p_now: input.now.toISOString(),
        p_note: input.note ?? null
      });
      if (error) throw new Error(error.message);
      const row = Array.isArray(data) ? data[0] : data;
      return {
        localDate: row.local_date,
        alreadyCheckedIn: row.already_checked_in,
        pointsAdded: row.points_added,
        checkInDays: row.check_in_days,
        newBadges: row.new_badges ?? []
      };
    }
  };
}
