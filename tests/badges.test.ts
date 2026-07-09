import assert from "node:assert/strict";
import test from "node:test";
import { getEarnedBadgeNames } from "../lib/domain/badges.ts";

test("awards 飞轮启动者 after seven check-in days", () => {
  const result = getEarnedBadgeNames({
    totalPoints: 20,
    checkInDays: 7,
    completedLessons: 1,
    submittedAssignments: 1
  });

  assert.ok(result.includes("飞轮启动者"));
});

test("does not award V1 backlog badges outside frozen criteria", () => {
  const result = getEarnedBadgeNames({
    totalPoints: 0,
    checkInDays: 0,
    completedLessons: 0,
    submittedAssignments: 0
  });

  assert.deepEqual(result, []);
});
