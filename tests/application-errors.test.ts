import assert from "node:assert/strict";
import test from "node:test";
import { AppError } from "../lib/application/errors.ts";

test("AppError preserves a stable code and safe message", () => {
  const cause = new Error("database connection detail");
  const error = new AppError("NOT_FOUND", "资源不存在", cause);

  assert.equal(error.name, "AppError");
  assert.equal(error.code, "NOT_FOUND");
  assert.equal(error.message, "资源不存在");
  assert.equal(error.cause, cause);
});
