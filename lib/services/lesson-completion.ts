import { getEarnedBadgeNames } from "../domain/badges.ts";
import { buildPointEventKey } from "../domain/points.ts";
import type { ProgressStats } from "./check-ins.ts";

export type LessonEnrollment = {
  organizationId: string;
  campId: string;
  enrollmentId: string;
  userId: string;
};

export type LessonProgressRow = {
  id: string;
  status: "not_started" | "in_progress" | "completed";
};

export type LessonCompletionRepository = {
  getActiveEnrollment(userId: string): Promise<LessonEnrollment | null>;
  findLessonProgress(input: {
    enrollmentId: string;
    lessonId: string;
  }): Promise<LessonProgressRow | null>;
  markLessonCompleted(input: {
    enrollmentId: string;
    lessonId: string;
    completedAt: Date;
  }): Promise<{ id: string }>;
  addPointLedger(input: {
    organizationId: string;
    campId: string;
    enrollmentId: string;
    userId: string;
    eventKey: string;
    delta: number;
    reason: string;
  }): Promise<{ inserted: boolean; delta: number }>;
  getProgressStats(input: {
    enrollmentId: string;
    userId: string;
    campId: string;
  }): Promise<ProgressStats>;
  getAwardedBadgeNames(input: {
    userId: string;
    campId: string;
  }): Promise<string[]>;
  awardBadge(input: {
    organizationId: string;
    campId: string;
    enrollmentId: string;
    userId: string;
    badgeName: string;
    sourceEventKey: string;
  }): Promise<void>;
};

export type LessonCompletionResult = {
  lessonId: string;
  alreadyCompleted: boolean;
  pointsAdded: number;
  completedLessons: number;
  newBadges: string[];
};

export async function completeLesson(input: {
  userId: string;
  lessonId: string;
  now: Date;
  repository: LessonCompletionRepository;
}): Promise<LessonCompletionResult> {
  const enrollment = await input.repository.getActiveEnrollment(input.userId);

  if (!enrollment) {
    throw new Error("NO_ACTIVE_ENROLLMENT");
  }

  const existing = await input.repository.findLessonProgress({
    enrollmentId: enrollment.enrollmentId,
    lessonId: input.lessonId
  });

  if (existing?.status === "completed") {
    const stats = await input.repository.getProgressStats({
      enrollmentId: enrollment.enrollmentId,
      userId: enrollment.userId,
      campId: enrollment.campId
    });

    return {
      lessonId: input.lessonId,
      alreadyCompleted: true,
      pointsAdded: 0,
      completedLessons: stats.completedLessons,
      newBadges: []
    };
  }

  await input.repository.markLessonCompleted({
    enrollmentId: enrollment.enrollmentId,
    lessonId: input.lessonId,
    completedAt: input.now
  });

  const eventKey = buildPointEventKey({
    eventType: "lesson_completed",
    enrollmentId: enrollment.enrollmentId,
    targetId: input.lessonId
  });

  const pointResult = await input.repository.addPointLedger({
    organizationId: enrollment.organizationId,
    campId: enrollment.campId,
    enrollmentId: enrollment.enrollmentId,
    userId: enrollment.userId,
    eventKey,
    delta: 5,
    reason: "完成课程学习"
  });

  const stats = await input.repository.getProgressStats({
    enrollmentId: enrollment.enrollmentId,
    userId: enrollment.userId,
    campId: enrollment.campId
  });
  const earnedBadgeNames = getEarnedBadgeNames(stats);
  const awardedBadgeNames = await input.repository.getAwardedBadgeNames({
    userId: enrollment.userId,
    campId: enrollment.campId
  });
  const newBadges = earnedBadgeNames.filter(
    (name) => !awardedBadgeNames.includes(name)
  );

  for (const badgeName of newBadges) {
    await input.repository.awardBadge({
      organizationId: enrollment.organizationId,
      campId: enrollment.campId,
      enrollmentId: enrollment.enrollmentId,
      userId: enrollment.userId,
      badgeName,
      sourceEventKey: eventKey
    });
  }

  return {
    lessonId: input.lessonId,
    alreadyCompleted: false,
    pointsAdded: pointResult.inserted ? pointResult.delta : 0,
    completedLessons: stats.completedLessons,
    newBadges
  };
}

