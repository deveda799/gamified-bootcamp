import { NextResponse } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getMissingSupabaseEnvApiError } from "@/lib/api/supabase-env-response";
import { createSupabaseAssignmentSubmissionRepository } from "@/lib/repositories/assignment-submission.supabase";
import { saveAssignmentDraft } from "@/lib/services/assignment-submission";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

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

    if (typeof body.assignmentId !== "string") {
      return NextResponse.json(apiError("BAD_REQUEST", "缺少 assignmentId"), {
        status: 400
      });
    }

    const repository = createSupabaseAssignmentSubmissionRepository(
      createServiceClient()
    );

    const result = await saveAssignmentDraft({
      userId: user.id,
      assignmentId: body.assignmentId,
      textContent:
        typeof body.textContent === "string" ? body.textContent : null,
      linkUrl: typeof body.linkUrl === "string" ? body.linkUrl : null,
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
      apiError("SUBMISSION_DRAFT_FAILED", "保存草稿失败，请稍后重试"),
      { status: 500 }
    );
  }
}
