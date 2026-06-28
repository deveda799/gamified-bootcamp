import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { requireCurrentUser } from "@/lib/application/use-cases/auth";
import { updateProfile } from "@/lib/application/use-cases/profile";
import { createAuthDependencies } from "@/lib/composition/request";
import { toApiErrorResponse } from "@/lib/presentation/api-error-response";

export async function PUT(request: Request) {
  try {
    const dependencies = await createAuthDependencies();
    const user = await requireCurrentUser(dependencies);
    const body = await request.json();
    const profile = await updateProfile(
      {
        userId: user.id,
        nickname: typeof body.nickname === "string" ? body.nickname : "",
        leaderboardAnonymous: body.leaderboardAnonymous === true
      },
      dependencies.profileRepository
    );

    return NextResponse.json(apiSuccess(profile));
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
