import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { requireCurrentUser } from "@/lib/application/use-cases/auth";
import { getLesson } from "@/lib/application/use-cases/course";
import { createAuthDependencies } from "@/lib/composition/request";
import { toApiErrorResponse } from "@/lib/presentation/api-error-response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const dependencies = await createAuthDependencies();
    const user = await requireCurrentUser(dependencies);
    const data = await getLesson({ userId: user.id, lessonId }, dependencies);
    return NextResponse.json(apiSuccess(data));
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
