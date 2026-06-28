import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migrationPath = "supabase/migrations/0001_mvp_v1_schema.sql";

test("business schema does not depend on the Supabase auth schema", () => {
  const sql = readFileSync(migrationPath, "utf8");

  assert.doesNotMatch(sql, /references\s+auth\.users/i);
  assert.doesNotMatch(sql, /auth\.uid\(\)/i);
  assert.match(sql, /create table app_users/i);
  assert.match(sql, /create table auth_identities/i);
});

test("critical commands are implemented as database transactions", () => {
  const sql = readFileSync(migrationPath, "utf8");

  assert.match(sql, /function provision_app_user/i);
  assert.match(sql, /function check_in_today/i);
  assert.match(sql, /function complete_lesson/i);
  assert.match(sql, /function submit_assignment/i);
});

test("business event tables enforce idempotency", () => {
  const sql = readFileSync(migrationPath, "utf8");

  assert.match(sql, /unique\s*\(\s*enrollment_id\s*,\s*local_date\s*\)/i);
  assert.match(sql, /unique\s*\(\s*enrollment_id\s*,\s*lesson_id\s*\)/i);
  assert.match(sql, /unique\s*\(\s*enrollment_id\s*,\s*assignment_id\s*\)/i);
  assert.match(sql, /event_key\s+text\s+not\s+null\s+unique/i);
  assert.match(
    sql,
    /unique\s*\(\s*user_id\s*,\s*camp_id\s*,\s*badge_id\s*\)/i
  );
});
