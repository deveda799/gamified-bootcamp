import assert from "node:assert/strict";
import test from "node:test";
import { mapAdminOverview } from "../lib/queries/admin.ts";

test("maps admin overview counts from score rows", () => {
  const result = mapAdminOverview([
    {
      totalPoints: 120,
      checkInDays: 3,
      completedLessons: 2,
      submittedAssignments: 1
    },
    {
      totalPoints: 50,
      checkInDays: 0,
      completedLessons: 1,
      submittedAssignments: 0
    }
  ]);

  assert.deepEqual(result, {
    studentsCount: 2,
    todayCheckIns: 0,
    completedLessons: 3,
    submittedAssignments: 1
  });
});

