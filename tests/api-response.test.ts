import assert from "node:assert/strict";
import test from "node:test";
import { apiError, apiSuccess } from "../lib/api/response.ts";

test("wraps successful API data with ok true", () => {
  const result = apiSuccess({ id: "camp-1" });

  assert.deepEqual(result, {
    ok: true,
    data: { id: "camp-1" }
  });
});

test("wraps API errors with code and message", () => {
  const result = apiError("UNAUTHORIZED", "请先登录");

  assert.deepEqual(result, {
    ok: false,
    error: {
      code: "UNAUTHORIZED",
      message: "请先登录"
    }
  });
});

