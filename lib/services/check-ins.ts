import { getEarnedBadgeNames } from "../domain/badges.ts";
import { toLocalDateString } from "../domain/check-ins.ts";
import { buildPointEventKey } from "../domain/points.ts";

export type ActiveEnrollment = {
  organizationId: string;
  campId: string;
  enrollmentId: string;
  userId: string;
  timezone: string;
};

export type ProgressStats = {
  totalPoints: number;
  checkInDays: number;
  completedLessons: number;
  submittedAssignments: number;
};

export type CheckInRepository = {
  getActiveEnrollment(userId: string): Promise<ActiveEnrollment | null>;
  findCheckInByDate(input: {
    enrollmentId: string;
    localDate: string;
  }): Promise<{ id: string } | null>;
  createCheckIn(input: {
    enrollmentId: string;
    localDate: string;
    note?: string;
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

export type CheckInResult = {
  localDate: string;
  alreadyCheckedIn: boolean;
  pointsAdded: number;
  checkInDays: number;
  newBadges: string[];
};

export async function checkInToday(input: {
  userId: string;
  note?: string;
  now: Date;
  repository: CheckInRepository;
}): Promise<CheckInResult> {
  const enrollment = await input.repository.getActiveEnrollment(input.userId);

  if (!enrollment) {
    throw new Error("NO_ACTIVE_ENROLLMENT");
  }

  const localDate = toLocalDateString(input.now, enrollment.timezone);
  const existing = await input.repository.findCheckInByDate({
    enrollmentId: enrollment.enrollmentId,
    localDate
  });

  if (existing) {
    const stats = await input.repository.getProgressStats({
      enrollmentId: enrollment.enrollmentId,
      userId: enrollment.userId,
      campId: enrollment.campId
    });

    return {
      localDate,
      alreadyCheckedIn: true,
      pointsAdded: 0,
      checkInDays: stats.checkInDays,
      newBadges: []
    };
  }

  await input.repository.createCheckIn({
    enrollmentId: enrollment.enrollmentId,
    localDate,
    note: input.note
  });

  const eventKey = buildPointEventKey({
    eventType: "daily_check_in",
    enrollmentId: enrollment.enrollmentId,
    targetId: localDate
  });

  const pointResult = await input.repository.addPointLedger({
    organizationId: enrollment.organizationId,
    campId: enrollment.campId,
    enrollmentId: enrollment.enrollmentId,
    userId: enrollment.userId,
    eventKey,
    delta: 2,
    reason: "每日签到"
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
    localDate,
    alreadyCheckedIn: false,
    pointsAdded: pointResult.inserted ? pointResult.delta : 0,
    checkInDays: stats.checkInDays,
    newBadges
  };
}

