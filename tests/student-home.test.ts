import assert from "node:assert/strict";
import test from "node:test";
import { mapStudentHome } from "../lib/queries/student-home.ts";

test("maps student home data into the frozen V1 home contract", () => {
  const result = mapStudentHome({
    campId: "camp-1",
    campTitle: "AI人生操作系统创造营",
    startsAt: "2026-06-20T00:00:00.000Z",
    now: new Date("2026-06-23T04:00:00.000Z"),
    nickname: "Jenny",
    totalPoints: 100,
    checkedInToday: false,
    nextLessonId: "lesson-1",
    nextLessonTitle: "认识人生操作系统",
    latestBadgeName: "觉醒者"
  });

  assert.equal(result.camp.id, "camp-1");
  assert.equal(result.camp.dayNo, 4);
  assert.equal(result.score.levelName, "探索者");
  assert.equal(result.today.checkedIn, false);
  assert.equal(result.today.primaryAction.href, "/app/course/lesson-1");
  assert.equal(result.badges.latest?.name, "觉醒者");
});
