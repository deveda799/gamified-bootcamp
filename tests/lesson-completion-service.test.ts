import assert from "node:assert/strict";
import test from "node:test";
import {
  completeLesson,
  type LessonCompletionRepository
} from "../lib/services/lesson-completion.ts";

function createRepository(overrides: Partial<LessonCompletionRepository> = {}) {
  const calls = {
    markLessonCompleted: 0,
    addPointLedger: 0,
    awardBadge: 0
  };

  const repository: LessonCompletionRepository = {
    async getActiveEnrollment() {
      return {
        organizationId: "org-1",
        campId: "camp-1",
        enrollmentId: "enrollment-1",
        userId: "user-1"
      };
    },
    async findLessonProgress() {
      return null;
    },
    async markLessonCompleted() {
      calls.markLessonCompleted += 1;
      return { id: "progress-1" };
    },
    async addPointLedger() {
      calls.addPointLedger += 1;
      return { inserted: true, delta: 5 };
    },
    async getProgressStats() {
      return {
        totalPoints: 5,
        checkInDays: 0,
        completedLessons: 1,
        submittedAssignments: 0
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

test("marks a lesson completed and awards lesson completion points once", async () => {
  const { repository, calls } = createRepository();

  const result = await completeLesson({
    userId: "user-1",
    lessonId: "lesson-1",
    now: new Date("2026-06-23T02:00:00.000Z"),
    repository
  });

  assert.equal(result.alreadyCompleted, false);
  assert.equal(result.pointsAdded, 5);
  assert.equal(calls.markLessonCompleted, 1);
  assert.equal(calls.addPointLedger, 1);
});

test("does not award points when lesson was already completed", async () => {
  const { repository, calls } = createRepository({
    async findLessonProgress() {
      return { id: "progress-1", status: "completed" };
    }
  });

  const result = await completeLesson({
    userId: "user-1",
    lessonId: "lesson-1",
    now: new Date("2026-06-23T02:00:00.000Z"),
    repository
  });

  assert.equal(result.alreadyCompleted, true);
  assert.equal(result.pointsAdded, 0);
  assert.equal(calls.markLessonCompleted, 0);
  assert.equal(calls.addPointLedger, 0);
});

test("returns new badge names when lesson completion reaches badge criteria", async () => {
  const { repository, calls } = createRepository();

  const result = await completeLesson({
    userId: "user-1",
    lessonId: "lesson-1",
    now: new Date("2026-06-23T02:00:00.000Z"),
    repository
  });

  assert.deepEqual(result.newBadges, ["觉醒者"]);
  assert.equal(calls.awardBadge, 1);
});

test("throws a clear error when completing a lesson without active enrollment", async () => {
  const { repository } = createRepository({
    async getActiveEnrollment() {
      return null;
    }
  });

  await assert.rejects(
    () =>
      completeLesson({
        userId: "user-1",
        lessonId: "lesson-1",
        now: new Date("2026-06-23T02:00:00.000Z"),
        repository
      }),
    /NO_ACTIVE_ENROLLMENT/
  );
});
