import assert from "node:assert/strict";
import test from "node:test";
import { AppError } from "../lib/application/errors.ts";
import { validateCredentials } from "../lib/application/use-cases/auth.ts";

test("credentials require a valid email", () => {
  assert.throws(
    () => validateCredentials({ email: "not-an-email", password: "StrongPass123!" }),
    (error) =>
      error instanceof AppError
      && error.code === "VALIDATION_ERROR"
      && error.message === "请输入有效邮箱"
  );
});

test("credentials require at least eight password characters", () => {
  assert.throws(
    () => validateCredentials({ email: "jenny@example.com", password: "short" }),
    (error) =>
      error instanceof AppError
      && error.code === "VALIDATION_ERROR"
      && error.message === "密码至少需要 8 位"
  );
});

test("credentials normalize the email", () => {
  assert.deepEqual(
    validateCredentials({
      email: " Jenny@Example.com ",
      password: "StrongPass123!"
    }),
    {
      email: "jenny@example.com",
      password: "StrongPass123!"
    }
  );
});
