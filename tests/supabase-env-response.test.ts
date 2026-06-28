import assert from "node:assert/strict";
import test from "node:test";
import { apiError } from "../lib/api/response.ts";
import {
  getMissingSupabaseEnvApiError,
  isMissingSupabaseEnvError
} from "../lib/api/supabase-env-response.ts";
import { MissingSupabaseEnvError } from "../lib/supabase/env.ts";

test("detects missing Supabase environment errors", () => {
  assert.equal(
    isMissingSupabaseEnvError(
      new MissingSupabaseEnvError(["NEXT_PUBLIC_SUPABASE_URL"])
    ),
    true
  );

  assert.equal(isMissingSupabaseEnvError(new Error("other")), false);
});

test("maps missing Supabase environment to a safe API error", () => {
  const result = getMissingSupabaseEnvApiError(
    new MissingSupabaseEnvError(["SUPABASE_SERVICE_ROLE_KEY"])
  );

  assert.deepEqual(result, {
    status: 503,
    body: apiError(
      "SUPABASE_ENV_MISSING",
      "Supabase 环境变量未配置完整，请先检查 .env.local"
    )
  });
});

test("returns null for non Supabase environment errors", () => {
  assert.equal(getMissingSupabaseEnvApiError(new Error("other")), null);
});
