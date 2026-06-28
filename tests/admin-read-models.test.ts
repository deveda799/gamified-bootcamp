import assert from "node:assert/strict";
import test from "node:test";
import {
  mapAdminCheckIns,
  mapAdminStudents,
  mapAdminSubmissions
} from "../lib/queries/admin-read-models.ts";

test("maps admin student rows into readonly table items", () => {
  const result = mapAdminStudents([
    {
      user_id: "user-1",
      nickname: "Jenny",
      total_points: 120,
      level_name: "探索者",
      check_in_days: 7,
      submitted_assignments: 3
    }
  ]);

  assert.deepEqual(result, [
    {
      userId: "user-1",
      nickname: "Jenny",
      totalPoints: 120,
      levelName: "探索者",
      checkInDays: 7,
      submittedAssignments: 3
    }
  ]);
});

test("maps admin submission rows into readonly table items", () => {
  const result = mapAdminSubmissions([
    {
      id: "submission-1",
      assignment_title: "价值观地图",
      nickname: "Jenny",
      status: "submitted",
      submitted_at: "2026-06-23T02:00:00.000Z"
    }
  ]);

  assert.equal(result[0].assignmentTitle, "价值观地图");
  assert.equal(result[0].studentName, "Jenny");
  assert.equal(result[0].status, "submitted");
});

test("maps admin check-in rows into readonly table items", () => {
  const result = mapAdminCheckIns([
    {
      id: "check-in-1",
      nickname: "Jenny",
      local_date: "2026-06-23",
      note: "今天完成第一课"
    }
  ]);

  assert.deepEqual(result, [
    {
      id: "check-in-1",
      studentName: "Jenny",
      localDate: "2026-06-23",
      note: "今天完成第一课"
    }
  ]);
});

