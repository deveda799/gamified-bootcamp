import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AssignmentEnrollment,
  AssignmentSubmissionRepository,
  AssignmentSubmissionRow
} from "../services/assignment-submission";
import type { ProgressStats } from "../services/check-ins";

type EnrollmentRow = {
  id: string;
  camp_id: string;
  user_id: string;
  camps: {
    organization_id: string;
  } | null;
};

type ScoreRow = {
  total_points: number | null;
  check_in_days: number | null;
  completed_lessons: number | null;
  submitted_assignments: number | null;
};

export function createSupabaseAssignmentSubmissionRepository(
  supabase: SupabaseClient
): AssignmentSubmissionRepository {
  return {
    async getActiveEnrollment(userId: string): Promise<AssignmentEnrollment | null> {
      const { data, error } = await supabase
        .from("enrollments")
        .select("id,camp_id,user_id,camps(organization_id)")
        .eq("user_id", userId)
        .eq("status", "active")
        .limit(1)
        .maybeSingle<EnrollmentRow>();

      if (error) {
        throw new Error(error.message);
      }

      if (!data || !data.camps) {
        return null;
      }

      return {
        organizationId: data.camps.organization_id,
        campId: data.camp_id,
        enrollmentId: data.id,
        userId: data.user_id
      };
    },

    async getSubmission(input) {
      const { data, error } = await supabase
        .from("submissions")
        .select("id,status")
        .eq("enrollment_id", input.enrollmentId)
        .eq("assignment_id", input.assignmentId)
        .maybeSingle<AssignmentSubmissionRow>();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },

    async saveSubmission(input) {
      const { data, error } = await supabase
        .from("submissions")
        .upsert(
          {
            enrollment_id: input.enrollmentId,
            assignment_id: input.assignmentId,
            status: input.status,
            text_content: input.textContent ?? null,
            link_url: input.linkUrl ?? null,
            submitted_at: input.submittedAt?.toISOString() ?? null
          },
          {
            onConflict: "enrollment_id,assignment_id"
          }
        )
        .select("id,status")
        .single<AssignmentSubmissionRow>();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },

    async addPointLedger(input) {
      const { error } = await supabase.from("point_ledger").insert({
        organization_id: input.organizationId,
        camp_id: input.campId,
        enrollment_id: input.enrollmentId,
        user_id: input.userId,
        event_type: "assignment_submitted",
        event_key: input.eventKey,
        delta: input.delta,
        reason: input.reason
      });

      if (error) {
        if (error.code === "23505") {
          return { inserted: false, delta: 0 };
        }

        throw new Error(error.message);
      }

      return { inserted: true, delta: input.delta };
    },

    async getProgressStats(input): Promise<ProgressStats> {
      const { data, error } = await supabase
        .from("v_enrollment_scores")
        .select(
          "total_points,check_in_days,completed_lessons,submitted_assignments"
        )
        .eq("enrollment_id", input.enrollmentId)
        .maybeSingle<ScoreRow>();

      if (error) {
        throw new Error(error.message);
      }

      return {
        totalPoints: data?.total_points ?? 0,
        checkInDays: data?.check_in_days ?? 0,
        completedLessons: data?.completed_lessons ?? 0,
        submittedAssignments: data?.submitted_assignments ?? 0
      };
    },

    async getAwardedBadgeNames(input) {
      const { data, error } = await supabase
        .from("badge_awards")
        .select("badges(name)")
        .eq("user_id", input.userId)
        .eq("camp_id", input.campId);

      if (error) {
        throw new Error(error.message);
      }

      return (data ?? [])
        .map((row) => {
          const badge = row.badges as { name?: string } | null;
          return badge?.name;
        })
        .filter((name): name is string => Boolean(name));
    },

    async awardBadge(input) {
      const { data: badge, error: badgeError } = await supabase
        .from("badges")
        .select("id")
        .eq("organization_id", input.organizationId)
        .eq("name", input.badgeName)
        .maybeSingle<{ id: string }>();

      if (badgeError) {
        throw new Error(badgeError.message);
      }

      if (!badge) {
        return;
      }

      const { error } = await supabase.from("badge_awards").insert({
        organization_id: input.organizationId,
        camp_id: input.campId,
        enrollment_id: input.enrollmentId,
        user_id: input.userId,
        badge_id: badge.id,
        source_event_key: input.sourceEventKey
      });

      if (error && error.code !== "23505") {
        throw new Error(error.message);
      }
    }
  };
}

