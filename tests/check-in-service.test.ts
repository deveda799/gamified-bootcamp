import assert from "node:assert/strict";
import test from "node:test";
import {
  checkInToday,
  type CheckInRepository
} from "../lib/services/check-ins.ts";

function createRepository(overrides: Partial<CheckInRepository> = {}) {
  const calls = {
    createCheckIn: 0,
    addPointLedger: 0,
    awardBadge: 0
  };

  const repository: CheckInRepository = {
    async getActiveEnrollment() {
      return {
        organizationId: "org-1",
        campId: "camp-1",
        enrollmentId: "enrollment-1",
        userId: "user-1",
        timezone: "Asia/Shanghai"
      };
    },
    async findCheckInByDate() {
      return null;
    },
    async createCheckIn() {
      calls.createCheckIn += 1;
      return { id: "check-in-1" };
    },
    async addPointLedger() {
      calls.addPointLedger += 1;
      return { inserted: true, delta: 2 };
    },
    async getProgressStats() {
      return {
        totalPoints: 2,
        checkInDays: 1,
        completedLessons: 0,
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

test("creates today's check-in and awards daily check-in points once", async () => {
  const { repository, calls } = createRepository();

  const result = await checkInToday({
    userId: "user-1",
    note: "今天完成了第一节课",
    now: new Date("2026-06-23T02:00:00.000Z"),
    repository
  });

  assert.equal(result.alreadyCheckedIn, false);
  assert.equal(result.localDate, "2026-06-23");
  assert.equal(result.pointsAdded, 2);
  assert.equal(calls.createCheckIn, 1);
  assert.equal(calls.addPointLedger, 1);
});

test("does not create check-in or points when user already checked in today", async () => {
  const { repository, calls } = createRepository({
    async findCheckInByDate() {
      return { id: "existing-check-in" };
    }
  });

  const result = await checkInToday({
    userId: "user-1",
    now: new Date("2026-06-23T02:00:00.000Z"),
    repository
  });

  assert.equal(result.alreadyCheckedIn, true);
  assert.equal(result.pointsAdded, 0);
  assert.equal(calls.createCheckIn, 0);
  assert.equal(calls.addPointLedger, 0);
});

test("returns new badge names when check-in reaches badge criteria", async () => {
  const { repository, calls } = createRepository({
    async getProgressStats() {
      return {
        totalPoints: 20,
        checkInDays: 7,
        completedLessons: 0,
        submittedAssignments: 0
      };
    }
  });

  const result = await checkInToday({
    userId: "user-1",
    now: new Date("2026-06-23T02:00:00.000Z"),
    repository
  });

  assert.deepEqual(result.newBadges, ["飞轮启动者"]);
  assert.equal(calls.awardBadge, 1);
});

test("throws a clear error when user has no active enrollment", async () => {
  const { repository } = createRepository({
    async getActiveEnrollment() {
      return null;
    }
  });

  await assert.rejects(
    () =>
      checkInToday({
        userId: "user-1",
        now: new Date("2026-06-23T02:00:00.000Z"),
        repository
      }),
    /NO_ACTIVE_ENROLLMENT/
  );
});
