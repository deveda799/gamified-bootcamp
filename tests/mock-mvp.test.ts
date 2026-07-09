import assert from "node:assert/strict";
import test from "node:test";
import {
  applyCheckIn,
  applySubmission,
  getLevel,
  initialProgress,
  lessons
} from "../lib/mockData.ts";

test("mock course contains Day1 through Day14", () => {
  assert.equal(lessons.length, 14);
  assert.deepEqual(
    lessons.map((lesson) => lesson.day),
    Array.from({ length: 14 }, (_, index) => index + 1)
  );
});

test("check-in adds points once", () => {
  const checkedIn = applyCheckIn(initialProgress);
  const repeated = applyCheckIn(checkedIn);

  assert.equal(checkedIn.checkedInToday, true);
  assert.equal(checkedIn.points, initialProgress.points + 5);
  assert.deepEqual(repeated, checkedIn);
});

test("submitting a lesson adds points once and completes the lesson", () => {
  const submitted = applySubmission(initialProgress, "day-4");
  const repeated = applySubmission(submitted, "day-4");

  assert.equal(submitted.points, initialProgress.points + 20);
  assert.ok(submitted.submittedLessonIds.includes("day-4"));
  assert.ok(submitted.completedLessonIds.includes("day-4"));
  assert.deepEqual(repeated, submitted);
});

test("level is derived from current points", () => {
  assert.equal(getLevel(0).name, "Lv1 新芽");
  assert.equal(getLevel(128).name, "Lv2 探索者");
  assert.equal(getLevel(220).name, "Lv3 架构师");
});
