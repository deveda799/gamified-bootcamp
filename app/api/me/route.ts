import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { getCurrentUser } from "@/lib/application/use-cases/auth";
import { createAuthDependencies } from "@/lib/composition/request";
import { toApiErrorResponse } from "@/lib/presentation/api-error-response";

export async function GET() {
  try {
    const user = await getCurrentUser(await createAuthDependencies());
    return NextResponse.json(apiSuccess({ user }));
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
