import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { requireCurrentUser } from "@/lib/application/use-cases/auth";
import { createAuthDependencies } from "@/lib/composition/request";
import { toApiErrorResponse } from "@/lib/presentation/api-error-response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ campId: string }> }
) {
  try {
    const { campId } = await params;
    const dependencies = await createAuthDependencies();
    const user = await requireCurrentUser(dependencies);
    const data = await dependencies.courseRepository.getPath({
      userId: user.id,
      campId
    });
    return NextResponse.json(apiSuccess(data));
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
