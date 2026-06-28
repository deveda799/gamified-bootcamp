import assert from "node:assert/strict";
import test from "node:test";
import { mapBadgeWall, mapPointLedger, mapLeaderboardItems } from "../lib/queries/growth-read-models.ts";

test("maps point ledger rows into timeline items", () => {
  const result = mapPointLedger([
    {
      id: "point-1",
      event_type: "daily_check_in",
      delta: 2,
      reason: "每日签到",
      created_at: "2026-06-23T02:00:00.000Z"
    }
  ]);

  assert.deepEqual(result, [
    {
      id: "point-1",
      eventType: "daily_check_in",
      delta: 2,
      reason: "每日签到",
      createdAt: "2026-06-23T02:00:00.000Z"
    }
  ]);
});

test("maps badge definitions and awards into earned and locked groups", () => {
  const result = mapBadgeWall(
    [
      { id: "badge-1", name: "觉醒者徽章", description: "完成首次课程学习", position: 1 },
      { id: "badge-2", name: "坚持王", description: "累计签到 7 天", position: 2 }
    ],
    [{ badge_id: "badge-1", awarded_at: "2026-06-23T02:00:00.000Z" }]
  );

  assert.equal(result.earned.length, 1);
  assert.equal(result.earned[0].name, "觉醒者徽章");
  assert.equal(result.locked.length, 1);
  assert.equal(result.locked[0].name, "坚持王");
});

test("maps leaderboard rows and respects anonymous display", () => {
  const result = mapLeaderboardItems([
    {
      rank_no: 1,
      nickname: "Jenny",
      is_anonymous_on_leaderboard: true,
      total_points: 120,
      submitted_assignments: 3,
      check_in_days: 7
    }
  ]);

  assert.deepEqual(result, [
    {
      rankNo: 1,
      displayName: "匿名学员",
      totalPoints: 120,
      submittedAssignments: 3,
      checkInDays: 7
    }
  ]);
});

