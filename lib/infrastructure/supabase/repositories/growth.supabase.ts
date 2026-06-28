import type { SupabaseClient } from "@supabase/supabase-js";
import type { GrowthRepository } from "@/lib/application/ports/growth-repository";

export function createSupabaseGrowthRepository(
  client: SupabaseClient
): GrowthRepository {
  return {
    async getSummary(input) {
      const { data, error } = await client
        .from("v_current_levels")
        .select("*")
        .eq("user_id", input.userId)
        .eq("camp_id", input.campId)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return {
        totalPoints: data?.total_points ?? 0,
        levelNo: data?.level_no ?? 1,
        levelName: data?.level_name ?? "觉醒者",
        nextLevelName: data?.next_level_name ?? null,
        pointsToNextLevel: data?.points_to_next_level ?? 100,
        badgesCount: data?.badges_count ?? 0,
        checkInDays: data?.check_in_days ?? 0,
        completedLessons: data?.completed_lessons ?? 0,
        submittedAssignments: data?.submitted_assignments ?? 0
      };
    },
    async getPoints(input) {
      const { data, error } = await client
        .from("point_ledger")
        .select("id,delta,reason,created_at")
        .eq("user_id", input.userId)
        .eq("camp_id", input.campId)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []).map((row) => ({
        id: row.id,
        delta: row.delta,
        reason: row.reason,
        createdAt: row.created_at
      }));
    },
    async getBadges(input) {
      const { data: enrollment } = await client
        .from("enrollments")
        .select("camps!inner(organization_id)")
        .eq("user_id", input.userId)
        .eq("camp_id", input.campId)
        .maybeSingle();
      const organizationId = (
        enrollment?.camps as unknown as { organization_id?: string } | undefined
      )?.organization_id;
      if (!organizationId) return [];
      const [{ data: badges }, { data: awards }] = await Promise.all([
        client
          .from("badges")
          .select("id,name,description,position")
          .eq("organization_id", organizationId)
          .eq("status", "published")
          .order("position"),
        client
          .from("badge_awards")
          .select("badge_id,awarded_at")
          .eq("user_id", input.userId)
          .eq("camp_id", input.campId)
      ]);
      const earned = new Map(
        (awards ?? []).map((award) => [award.badge_id, award.awarded_at])
      );
      return (badges ?? []).map((badge) => ({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        earned: earned.has(badge.id),
        awardedAt: earned.get(badge.id) ?? null
      }));
    }
  };
}
