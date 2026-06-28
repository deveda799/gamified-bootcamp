import assert from "node:assert/strict";
import test from "node:test";
import { canAccessAdmin } from "../lib/auth/roles.ts";

test("allows only owner admin and assistant to access admin pages", () => {
  assert.equal(canAccessAdmin("owner"), true);
  assert.equal(canAccessAdmin("admin"), true);
  assert.equal(canAccessAdmin("assistant"), true);
  assert.equal(canAccessAdmin("student"), false);
});

