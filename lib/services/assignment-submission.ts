import { getEarnedBadgeNames } from "../domain/badges.ts";
import { buildPointEventKey } from "../domain/points.ts";
import type { ProgressStats } from "./check-ins.ts";

export type AssignmentEnrollment = {
  organizationId: string;
  campId: string;
  enrollmentId: string;
  userId: string;
};

export type AssignmentSubmissionRow = {
  id: string;
  status: "draft" | "submitted" | "withdrawn";
};

export type AssignmentSubmissionRepository = {
  getActiveEnrollment(userId: string): Promise<AssignmentEnrollment | null>;
  getSubmission(input: {
    enrollmentId: string;
    assignmentId: string;
  }): Promise<AssignmentSubmissionRow | null>;
  saveSubmission(input: {
    enrollmentId: string;
    assignmentId: string;
    status: "draft" | "submitted";
    textContent?: string | null;
    linkUrl?: string | null;
    submittedAt?: Date | null;
  }): Promise<AssignmentSubmissionRow>;
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

export type AssignmentDraftResult = {
  submissionId: string;
  status: "draft";
};

export type AssignmentSubmitResult = {
  submissionId: string;
  status: "submitted";
  alreadySubmitted: boolean;
  pointsAdded: number;
  submittedAssignments: number;
  newBadges: string[];
};

async function requireActiveEnrollment(input: {
  userId: string;
  repository: AssignmentSubmissionRepository;
}) {
  const enrollment = await input.repository.getActiveEnrollment(input.userId);

  if (!enrollment) {
    throw new Error("NO_ACTIVE_ENROLLMENT");
  }

  return enrollment;
}

export async function saveAssignmentDraft(input: {
  userId: string;
  assignmentId: string;
  textContent?: string | null;
  linkUrl?: string | null;
  repository: AssignmentSubmissionRepository;
}): Promise<AssignmentDraftResult> {
  const enrollment = await requireActiveEnrollment(input);
  const saved = await input.repository.saveSubmission({
    enrollmentId: enrollment.enrollmentId,
    assignmentId: input.assignmentId,
    status: "draft",
    textContent: input.textContent,
    linkUrl: input.linkUrl,
    submittedAt: null
  });

  return {
    submissionId: saved.id,
    status: "draft"
  };
}

export async function submitAssignment(input: {
  userId: string;
  assignmentId: string;
  textContent?: string | null;
  linkUrl?: string | null;
  now: Date;
  repository: AssignmentSubmissionRepository;
}): Promise<AssignmentSubmitResult> {
  const enrollment = await requireActiveEnrollment(input);
  const existing = await input.repository.getSubmission({
    enrollmentId: enrollment.enrollmentId,
    assignmentId: input.assignmentId
  });

  if (existing?.status === "submitted") {
    const stats = await input.repository.getProgressStats({
      enrollmentId: enrollment.enrollmentId,
      userId: enrollment.userId,
      campId: enrollment.campId
    });

    return {
      submissionId: existing.id,
      status: "submitted",
      alreadySubmitted: true,
      pointsAdded: 0,
      submittedAssignments: stats.submittedAssignments,
      newBadges: []
    };
  }

  const saved = await input.repository.saveSubmission({
    enrollmentId: enrollment.enrollmentId,
    assignmentId: input.assignmentId,
    status: "submitted",
    textContent: input.textContent,
    linkUrl: input.linkUrl,
    submittedAt: input.now
  });

  const eventKey = buildPointEventKey({
    eventType: "assignment_submitted",
    enrollmentId: enrollment.enrollmentId,
    targetId: input.assignmentId
  });

  const pointResult = await input.repository.addPointLedger({
    organizationId: enrollment.organizationId,
    campId: enrollment.campId,
    enrollmentId: enrollment.enrollmentId,
    userId: enrollment.userId,
    eventKey,
    delta: 10,
    reason: "提交作业"
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
    submissionId: saved.id,
    status: "submitted",
    alreadySubmitted: false,
    pointsAdded: pointResult.inserted ? pointResult.delta : 0,
    submittedAssignments: stats.submittedAssignments,
    newBadges
  };
}

