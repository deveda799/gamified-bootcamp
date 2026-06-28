import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CourseRepository,
  CourseLessonStatus
} from "@/lib/application/ports/course-repository";

export function createSupabaseCourseRepository(
  client: SupabaseClient
): CourseRepository {
  return {
    async getPath(input) {
      const { data: enrollment } = await client
        .from("enrollments")
        .select("id")
        .eq("user_id", input.userId)
        .eq("camp_id", input.campId)
        .eq("status", "active")
        .maybeSingle<{ id: string }>();

      if (!enrollment) {
        throw new Error("COURSE_NOT_AVAILABLE");
      }

      const { data: camp, error: campError } = await client
        .from("camps")
        .select("id,title,course_id")
        .eq("id", input.campId)
        .single<{ id: string; title: string; course_id: string }>();

      if (campError) throw new Error(campError.message);

      const { data: modules, error: moduleError } = await client
        .from("modules")
        .select("id,title,position")
        .eq("course_id", camp.course_id)
        .order("position");

      if (moduleError) throw new Error(moduleError.message);

      const moduleIds = (modules ?? []).map((module) => module.id);
      const { data: lessons, error: lessonError } = moduleIds.length
        ? await client
            .from("lessons")
            .select("id,module_id,title,position")
            .in("module_id", moduleIds)
            .eq("status", "published")
            .order("position")
        : { data: [], error: null };

      if (lessonError) throw new Error(lessonError.message);

      const lessonIds = (lessons ?? []).map((lesson) => lesson.id);
      const { data: progress, error: progressError } = lessonIds.length
        ? await client
            .from("lesson_progress")
            .select("lesson_id,status")
            .eq("enrollment_id", enrollment.id)
            .in("lesson_id", lessonIds)
        : { data: [], error: null };

      if (progressError) throw new Error(progressError.message);
      const statuses = new Map(
        (progress ?? []).map((item) => [
          item.lesson_id,
          item.status as CourseLessonStatus
        ])
      );

      return {
        campId: camp.id,
        campTitle: camp.title,
        modules: (modules ?? []).map((module) => ({
          id: module.id,
          title: module.title,
          lessons: (lessons ?? [])
            .filter((lesson) => lesson.module_id === module.id)
            .map((lesson) => ({
              id: lesson.id,
              title: lesson.title,
              status: statuses.get(lesson.id) ?? "not_started"
            }))
        }))
      };
    },

    async getLesson(input) {
      const { data: enrollment } = await client
        .from("enrollments")
        .select("id,camps!inner(course_id)")
        .eq("user_id", input.userId)
        .eq("status", "active")
        .limit(1)
        .maybeSingle();

      if (!enrollment) return null;
      const courseId = (enrollment.camps as unknown as { course_id: string })
        .course_id;
      const { data: lesson, error } = await client
        .from("lessons")
        .select("id,title,summary,content_md,module_id,modules!inner(course_id)")
        .eq("id", input.lessonId)
        .eq("modules.course_id", courseId)
        .eq("status", "published")
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!lesson) return null;

      const [{ data: assets }, { data: assignment }, { data: progress }] =
        await Promise.all([
          client
            .from("lesson_assets")
            .select("id,type,title,storage_path,external_url,content,position")
            .eq("lesson_id", lesson.id)
            .order("position"),
          client
            .from("assignments")
            .select("id,title")
            .eq("lesson_id", lesson.id)
            .order("position")
            .limit(1)
            .maybeSingle(),
          client
            .from("lesson_progress")
            .select("status")
            .eq("enrollment_id", enrollment.id)
            .eq("lesson_id", lesson.id)
            .maybeSingle<{ status: CourseLessonStatus }>()
        ]);

      return {
        id: lesson.id,
        title: lesson.title,
        summary: lesson.summary,
        contentMd: lesson.content_md,
        status: progress?.status ?? "not_started",
        assets: (assets ?? []).map((asset) => ({
          id: asset.id,
          type: asset.type,
          title: asset.title,
          url: asset.external_url ?? asset.storage_path,
          content: asset.content
        })),
        assignment: assignment
          ? { id: assignment.id, title: assignment.title }
          : null
      };
    },

    async completeLesson(input) {
      const { data, error } = await client.rpc("complete_lesson", {
        p_user_id: input.userId,
        p_lesson_id: input.lessonId,
        p_now: input.now.toISOString()
      });
      if (error) throw new Error(error.message);
      const row = Array.isArray(data) ? data[0] : data;
      return {
        lessonId: row.lesson_id,
        alreadyCompleted: row.already_completed,
        pointsAdded: row.points_added,
        completedLessons: row.completed_lessons,
        newBadges: row.new_badges ?? []
      };
    }
  };
}
