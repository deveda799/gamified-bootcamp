import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { signOut } from "@/lib/application/use-cases/auth";
import { createAuthDependencies } from "@/lib/composition/request";
import { toApiErrorResponse } from "@/lib/presentation/api-error-response";

export async function POST() {
  try {
    const { authProvider } = await createAuthDependencies();
    await signOut(authProvider);
    return NextResponse.json(apiSuccess({ signedOut: true }));
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
