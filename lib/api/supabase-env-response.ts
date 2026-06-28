import { apiError } from "./response.ts";
import { MissingSupabaseEnvError } from "../supabase/env.ts";

export function isMissingSupabaseEnvError(error: unknown) {
  return error instanceof MissingSupabaseEnvError;
}

export function getMissingSupabaseEnvApiError(error: unknown) {
  if (!isMissingSupabaseEnvError(error)) {
    return null;
  }

  return {
    status: 503,
    body: apiError(
      "SUPABASE_ENV_MISSING",
      "Supabase 环境变量未配置完整，请先检查 .env.local"
    )
  };
}
