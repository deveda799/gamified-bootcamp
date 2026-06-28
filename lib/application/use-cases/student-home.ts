import { AppError } from "../errors.ts";
import type { CheckInRepository } from "../ports/check-in-repository.ts";
import type { CourseRepository } from "../ports/course-repository.ts";
import type { EnrollmentRepository } from "../ports/enrollment-repository.ts";
import type { GrowthRepository } from "../ports/growth-repository.ts";
import type { ProfileRepository } from "../ports/profile-repository.ts";
import { toLocalDateString } from "../../domain/check-ins.ts";

type StudentHomeDependencies = {
  enrollmentRepository: EnrollmentRepository;
  courseRepository: CourseRepository;
  profileRepository: ProfileRepository;
  growthRepository: GrowthRepository;
  checkInRepository: CheckInRepository;
};

export async function getStudentHome(
  input: { userId: string; now: Date },
  dependencies: StudentHomeDependencies
) {
  const enrollment =
    await dependencies.enrollmentRepository.getActiveByUserId(input.userId);

  if (!enrollment) {
    throw new AppError("NOT_FOUND", "暂未加入训练营");
  }

  const [profile, course, summary, checkIns] = await Promise.all([
    dependencies.profileRepository.getByUserId(input.userId),
    dependencies.courseRepository.getPath({
      userId: input.userId,
      campId: enrollment.campId
    }),
    dependencies.growthRepository.getSummary({
      userId: input.userId,
      campId: enrollment.campId
    }),
    dependencies.checkInRepository.getMine(input.userId)
  ]);

  const lessons = course.modules.flatMap((module) => module.lessons);
  const nextLesson = lessons.find((lesson) => lesson.status !== "completed");
  const completedCount = lessons.filter(
    (lesson) => lesson.status === "completed"
  ).length;
  const today = toLocalDateString(input.now, enrollment.timezone);
  const start = new Date(enrollment.startsAt);
  const dayNo = Math.max(
    Math.floor((input.now.getTime() - start.getTime()) / 86_400_000) + 1,
    1
  );

  return {
    campId: enrollment.campId,
    campTitle: enrollment.campTitle,
    dayNo,
    nickname: profile?.nickname ?? "学员",
    totalPoints: summary.totalPoints,
    levelName: summary.levelName,
    progressPercent:
      lessons.length === 0 ? 0 : Math.round((completedCount / lessons.length) * 100),
    checkedInToday: checkIns.some((item) => item.localDate === today),
    primaryAction: nextLesson
      ? {
          title: nextLesson.title,
          href: `/app/course/${nextLesson.id}`
        }
      : {
          title: "课程已完成",
          href: "/app/course"
        }
  };
}
