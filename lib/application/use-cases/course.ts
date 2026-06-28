import { AppError } from "../errors.ts";
import type {
  CoursePath,
  CourseRepository,
  LessonDetail
} from "../ports/course-repository.ts";
import type { EnrollmentRepository } from "../ports/enrollment-repository.ts";

type CourseDependencies = {
  enrollmentRepository: EnrollmentRepository;
  courseRepository: CourseRepository;
};

export async function getCoursePath(
  userId: string,
  dependencies: CourseDependencies
): Promise<CoursePath> {
  const enrollment =
    await dependencies.enrollmentRepository.getActiveByUserId(userId);

  if (!enrollment) {
    throw new AppError("NOT_FOUND", "暂未加入训练营");
  }

  return dependencies.courseRepository.getPath({
    userId,
    campId: enrollment.campId
  });
}

export async function getLesson(
  input: { userId: string; lessonId: string },
  dependencies: Pick<CourseDependencies, "courseRepository">
): Promise<LessonDetail> {
  const lesson = await dependencies.courseRepository.getLesson(input);

  if (!lesson) {
    throw new AppError("NOT_FOUND", "课节不存在或无权访问");
  }

  return lesson;
}
