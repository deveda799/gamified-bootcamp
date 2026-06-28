import assert from "node:assert/strict";
import test from "node:test";
import { pickActiveEnrollment } from "../lib/queries/student-context.ts";

test("picks the first active enrollment for the current student", () => {
  const result = pickActiveEnrollment([
    { enrollmentId: "removed-1", campId: "camp-0", status: "removed" },
    { enrollmentId: "active-1", campId: "camp-1", status: "active" }
  ]);

  assert.equal(result?.enrollmentId, "active-1");
  assert.equal(result?.campId, "camp-1");
});

test("returns null when student has no active enrollment", () => {
  const result = pickActiveEnrollment([
    { enrollmentId: "paused-1", campId: "camp-1", status: "paused" }
  ]);

  assert.equal(result, null);
});

