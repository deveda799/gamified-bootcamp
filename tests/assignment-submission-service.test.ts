import assert from "node:assert/strict";
import test from "node:test";
import {
  saveAssignmentDraft,
  submitAssignment,
  type AssignmentSubmissionRepository
} from "../lib/services/assignment-submission.ts";

function createRepository(overrides: Partial<AssignmentSubmissionRepository> = {}) {
  const calls = {
    saveSubmission: 0,
    addPointLedger: 0,
    awardBadge: 0
  };

  const repository: AssignmentSubmissionRepository = {
    async getActiveEnrollment() {
      return {
        organizationId: "org-1",
        campId: "camp-1",
        enrollmentId: "enrollment-1",
        userId: "user-1"
      };
    },
    async getSubmission() {
      return null;
    },
    async saveSubmission(input) {
      calls.saveSubmission += 1;
      return {
        id: "submission-1",
        status: input.status
      };
    },
    async addPointLedger() {
      calls.addPointLedger += 1;
      return { inserted: true, delta: 10 };
    },
    async getProgressStats() {
      return {
        totalPoints: 10,
        checkInDays: 0,
        completedLessons: 0,
        submittedAssignments: 1
      };
    },
    async getAwardedBadgeNames() {
      return [];
    },
    async awardBadge() {
      calls.awardBadge += 1;
    },
    ...overrides
  };

  return { repository, calls };
}

test("saves assignment draft without awarding points", async () => {
  const { repository, calls } = createRepository();

  const result = await saveAssignmentDraft({
    userId: "user-1",
    assignmentId: "assignment-1",
    textContent: "草稿内容",
    linkUrl: "https://example.com",
    repository
  });

  assert.equal(result.status, "draft");
  assert.equal(calls.saveSubmission, 1);
  assert.equal(calls.addPointLedger, 0);
});

test("submits assignment and awards submission points once", async () => {
  const { repository, calls } = createRepository();

  const result = await submitAssignment({
    userId: "user-1",
    assignmentId: "assignment-1",
    textContent: "正式作业",
    linkUrl: null,
    now: new Date("2026-06-23T02:00:00.000Z"),
    repository
  });

  assert.equal(result.status, "submitted");
  assert.equal(result.pointsAdded, 10);
  assert.equal(calls.saveSubmission, 1);
  assert.equal(calls.addPointLedger, 1);
});

test("does not award points when assignment was already submitted", async () => {
  const { repository, calls } = createRepository({
    async getSubmission() {
      return { id: "submission-1", status: "submitted" };
    }
  });

  const result = await submitAssignment({
    userId: "user-1",
    assignmentId: "assignment-1",
    textContent: "再次提交",
    linkUrl: null,
    now: new Date("2026-06-23T02:00:00.000Z"),
    repository
  });

  assert.equal(result.alreadySubmitted, true);
  assert.equal(result.pointsAdded, 0);
  assert.equal(calls.addPointLedger, 0);
});

test("returns new badge names when submitted assignments reach badge criteria", async () => {
  const { repository, calls } = createRepository({
    async getProgressStats() {
      return {
        totalPoints: 30,
        checkInDays: 0,
        completedLessons: 0,
        submittedAssignments: 3
      };
    }
  });

  const result = await submitAssignment({
    userId: "user-1",
    assignmentId: "assignment-1",
    textContent: "正式作业",
    linkUrl: null,
    now: new Date("2026-06-23T02:00:00.000Z"),
    repository
  });

  assert.deepEqual(result.newBadges, ["项目猎人"]);
  assert.equal(calls.awardBadge, 1);
});

test("throws a clear error when saving draft without active enrollment", async () => {
  const { repository } = createRepository({
    async getActiveEnrollment() {
      return null;
    }
  });

  await assert.rejects(
    () =>
      saveAssignmentDraft({
        userId: "user-1",
        assignmentId: "assignment-1",
        textContent: "草稿",
        linkUrl: null,
        repository
      }),
    /NO_ACTIVE_ENROLLMENT/
  );
});

