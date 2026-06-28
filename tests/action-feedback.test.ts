import assert from "node:assert/strict";
import test from "node:test";
import { formatActionFeedback } from "../lib/client/action-feedback.ts";

test("formats successful action feedback with points and badges", () => {
  const result = formatActionFeedback({
    ok: true,
    data: {
      pointsAdded: 10,
      newBadges: ["项目猎人"]
    }
  });

  assert.ok(result);
  assert.equal(result.kind, "success");
  assert.equal(result.message, "已完成，获得 10 积分，新徽章：项目猎人");
});

test("formats already completed action feedback without points", () => {
  const result = formatActionFeedback({
    ok: true,
    data: {
      alreadyCheckedIn: true,
      pointsAdded: 0,
      newBadges: []
    }
  });

  assert.ok(result);
  assert.equal(result.kind, "info");
  assert.equal(result.message, "今天已经完成过了");
});

test("formats API error feedback", () => {
  const result = formatActionFeedback({
    ok: false,
    error: {
      code: "UNAUTHORIZED",
      message: "请先登录"
    }
  });

  assert.ok(result);
  assert.equal(result.kind, "error");
  assert.equal(result.message, "请先登录");
});
