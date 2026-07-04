import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createMvpStore } from "../lib/server/sqlite.ts";

test("nickname login reuses one student account", () => {
  const store = createMvpStore({
    path: ":memory:",
    today: () => "2026-07-04"
  });

  const first = store.loginByNickname(" Jenny ");
  const second = store.loginByNickname("jenny");

  assert.equal(first.student.id, second.student.id);
  assert.equal(first.student.nickname, "Jenny");
  assert.notEqual(first.token, second.token);
  store.close();
});

test("nickname login validates the public identifier", () => {
  const store = createMvpStore({ path: ":memory:" });

  assert.throws(() => store.loginByNickname("A"), /2.*20/);
  assert.throws(() => store.loginByNickname("x".repeat(21)), /2.*20/);
  store.close();
});

test("check-in and assignment points are idempotent", () => {
  const store = createMvpStore({
    path: ":memory:",
    today: () => "2026-07-04"
  });
  const { student } = store.loginByNickname("小雨");

  store.checkIn(student.id);
  store.checkIn(student.id);
  store.submitAssignment({
    studentId: student.id,
    lessonId: "day-1",
    text: "今天完成了第一课。",
    link: "https://example.cn/work"
  });
  const progress = store.submitAssignment({
    studentId: student.id,
    lessonId: "day-1",
    text: "重复提交不会重复积分。",
    link: ""
  });

  assert.deepEqual(progress, {
    points: 25,
    checkedInToday: true,
    completedLessonIds: ["day-1"],
    submittedLessonIds: ["day-1"]
  });
  store.close();
});

test("leaderboard reads real SQLite totals in score order", () => {
  const store = createMvpStore({
    path: ":memory:",
    today: () => "2026-07-04"
  });
  const a = store.loginByNickname("学员甲").student;
  const b = store.loginByNickname("学员乙").student;

  store.checkIn(a.id);
  store.submitAssignment({
    studentId: b.id,
    lessonId: "day-1",
    text: "作业",
    link: ""
  });

  assert.deepEqual(store.getLeaderboard(), [
    { nickname: "学员乙", points: 20 },
    { nickname: "学员甲", points: 5 }
  ]);
  store.close();
});

test("student progress survives a SQLite connection restart", () => {
  const directory = mkdtempSync(join(tmpdir(), "gamified-bootcamp-"));
  const path = join(directory, "app.sqlite");
  const first = createMvpStore({ path, today: () => "2026-07-04" });
  const { student } = first.loginByNickname("持久化学员");

  first.checkIn(student.id);
  first.submitAssignment({
    studentId: student.id,
    lessonId: "day-1",
    text: "完成",
    link: ""
  });
  first.close();

  const second = createMvpStore({ path, today: () => "2026-07-04" });
  assert.equal(second.getProgress(student.id).points, 25);
  assert.equal(second.getLeaderboard()[0]?.nickname, "持久化学员");
  second.close();
  rmSync(directory, { recursive: true, force: true });
});
