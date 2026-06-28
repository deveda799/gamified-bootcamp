import { NextResponse } from "next/server";
import { AppError } from "@/lib/application/errors";
import { apiError } from "@/lib/api/response";
import { MissingSupabaseEnvError } from "@/lib/supabase/env";

const statusByCode = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  FILE_TOO_LARGE: 413,
  UNSUPPORTED_FILE_TYPE: 415,
  INTERNAL_ERROR: 500
} as const;

export function toApiErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(apiError(error.code, error.message), {
      status: statusByCode[error.code]
    });
  }

  if (error instanceof MissingSupabaseEnvError) {
    return NextResponse.json(
      apiError("SERVICE_NOT_CONFIGURED", "服务尚未完成配置"),
      { status: 503 }
    );
  }

  return NextResponse.json(
    apiError("INTERNAL_ERROR", "服务暂时不可用，请稍后重试"),
    { status: 500 }
  );
}
