import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ActiveEnrollment,
  EnrollmentRepository
} from "@/lib/application/ports/enrollment-repository";

export function createSupabaseEnrollmentRepository(
  client: SupabaseClient
): EnrollmentRepository {
  return {
    async getActiveByUserId(userId) {
      const { data, error } = await client
        .from("enrollments")
        .select(
          "id,camp_id,user_id,camps!inner(organization_id,course_id,title,timezone,starts_at)"
        )
        .eq("user_id", userId)
        .eq("status", "active")
        .order("enrolled_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return null;
      }

      const camp = data.camps as unknown as {
        organization_id: string;
        course_id: string;
        title: string;
        timezone: string;
        starts_at: string;
      };

      return {
        id: data.id,
        organizationId: camp.organization_id,
        campId: data.camp_id,
        campTitle: camp.title,
        courseId: camp.course_id,
        userId: data.user_id,
        timezone: camp.timezone,
        startsAt: camp.starts_at
      } satisfies ActiveEnrollment;
    }
  };
}
