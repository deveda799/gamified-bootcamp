import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { signIn } from "@/lib/application/use-cases/auth";
import { createAuthDependencies } from "@/lib/composition/request";
import { toApiErrorResponse } from "@/lib/presentation/api-error-response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await signIn(body, await createAuthDependencies());
    return NextResponse.json(apiSuccess({ user }));
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
