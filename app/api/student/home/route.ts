import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { requireCurrentUser } from "@/lib/application/use-cases/auth";
import { getStudentHome } from "@/lib/application/use-cases/student-home";
import { createAuthDependencies } from "@/lib/composition/request";
import { toApiErrorResponse } from "@/lib/presentation/api-error-response";

export async function GET() {
  try {
    const dependencies = await createAuthDependencies();
    const user = await requireCurrentUser(dependencies);
    const data = await getStudentHome(
      { userId: user.id, now: new Date() },
      dependencies
    );
    return NextResponse.json(apiSuccess(data));
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
