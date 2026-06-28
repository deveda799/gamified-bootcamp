import assert from "node:assert/strict";
import test from "node:test";
import {
  getSupabaseBrowserEnv,
  getSupabaseServiceEnv,
  getSupabaseServerEnv,
  MissingSupabaseEnvError
} from "../lib/supabase/env.ts";

test("returns browser Supabase env when public values are present", () => {
  const env = getSupabaseBrowserEnv({
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key"
  });

  assert.deepEqual(env, {
    url: "https://example.supabase.co",
    anonKey: "anon-key"
  });
});

test("throws a clear error when browser Supabase env is missing", () => {
  assert.throws(
    () => getSupabaseBrowserEnv({ NEXT_PUBLIC_SUPABASE_URL: "" }),
    (error) => {
      assert.equal(error instanceof MissingSupabaseEnvError, true);
      assert.match(String(error), /NEXT_PUBLIC_SUPABASE_ANON_KEY/);
      assert.doesNotMatch(String(error), /anon-key/);
      return true;
    }
  );
});

test("returns server Supabase env when public values are present", () => {
  const env = getSupabaseServerEnv({
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key"
  });

  assert.deepEqual(env, {
    url: "https://example.supabase.co",
    anonKey: "anon-key"
  });
});

test("returns service Supabase env when service role is present", () => {
  const env = getSupabaseServiceEnv({
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "service-role-key"
  });

  assert.deepEqual(env, {
    url: "https://example.supabase.co",
    serviceRoleKey: "service-role-key"
  });
});

test("throws a clear error when service Supabase env is missing", () => {
  assert.throws(
    () => getSupabaseServiceEnv({ NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co" }),
    (error) => {
      assert.equal(error instanceof MissingSupabaseEnvError, true);
      assert.match(String(error), /SUPABASE_SERVICE_ROLE_KEY/);
      assert.doesNotMatch(String(error), /service-role-key/);
      return true;
    }
  );
});
