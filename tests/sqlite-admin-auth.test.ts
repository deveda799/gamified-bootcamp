import assert from "node:assert/strict";
import test from "node:test";
import { adminToken, isAdminTokenValid } from "../lib/server/auth.ts";

test("admin cookie token validates only against the configured password", () => {
  const token = adminToken("example-password");

  assert.equal(isAdminTokenValid(token, "example-password"), true);
  assert.equal(isAdminTokenValid(token, "wrong-password"), false);
  assert.equal(isAdminTokenValid("", "example-password"), false);
});
