import { NextResponse } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getMissingSupabaseEnvApiError } from "@/lib/api/supabase-env-response";
import { createSupabaseLessonCompletionRepository } from "@/lib/repositories/lesson-completion.supabase";
import { completeLesson } from "@/lib/services/lesson-completion";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params;

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

    const serviceClient = createServiceClient();
    const repository = createSupabaseLessonCompletionRepository(serviceClient);

    const result = await completeLesson({
      userId: user.id,
      lessonId,
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

    return NextResponse.json(
      apiError("LESSON_COMPLETE_FAILED", "课程完成失败，请稍后重试"),
      { status: 500 }
    );
  }
}
