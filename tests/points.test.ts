import assert from "node:assert/strict";
import test from "node:test";
import { buildPointEventKey } from "../lib/domain/points.ts";

test("builds an idempotent key for lesson completion points", () => {
  const key = buildPointEventKey({
    eventType: "lesson_completed",
    enrollmentId: "enroll-1",
    targetId: "lesson-1"
  });

  assert.equal(key, "lesson_completed:enroll-1:lesson-1");
});

test("builds an idempotent key for daily check-in points", () => {
  const key = buildPointEventKey({
    eventType: "daily_check_in",
    enrollmentId: "enroll-1",
    targetId: "2026-06-23"
  });

  assert.equal(key, "daily_check_in:enroll-1:2026-06-23");
});

