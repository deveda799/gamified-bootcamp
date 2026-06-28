import { NextResponse } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getMissingSupabaseEnvApiError } from "@/lib/api/supabase-env-response";
import { createSupabaseCheckInRepository } from "@/lib/repositories/check-ins.supabase";
import { checkInToday } from "@/lib/services/check-ins";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET() {
  return NextResponse.json(
    apiSuccess({
      items: []
    })
  );
}

export async function POST(request: Request) {
  try {
    const authClient = await createServerSupabaseClient();
    const {
      data: { user }
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json(apiError("UNAUTHORIZED", "请先登录"), {
        status: 401
      });
    }

    const body = await request.json().catch(() => ({}));
    const serviceClient = createServiceClient();
    const repository = createSupabaseCheckInRepository(serviceClient);

    const result = await checkInToday({
      userId: user.id,
      note: typeof body.note === "string" ? body.note : undefined,
      now: new Date(),
      repository
    });

    return NextResponse.json(apiSuccess(result));
  } catch (error) {
    const envError = getMissingSupabaseEnvApiError(error);

    if (envError) {
      return NextResponse.json(envError.body, { status: envError.status });
    }

    if (error instanceof Error && error.message === "NO_ACTIVE_ENROLLMENT") {
      return NextResponse.json(
        apiError("NO_ACTIVE_ENROLLMENT", "当前账号没有进行中的训练营"),
        { status: 404 }
      );
    }

    return NextResponse.json(apiError("CHECK_IN_FAILED", "签到失败，请稍后重试"), {
      status: 500
    });
  }
}
