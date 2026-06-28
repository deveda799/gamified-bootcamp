import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { calculateCurrentLevel, defaultLevelRules } from "@/lib/domain/levels";

export async function GET() {
  const totalPoints = 0;

  return NextResponse.json(
    apiSuccess({
      current: calculateCurrentLevel(totalPoints),
      rules: defaultLevelRules
    })
  );
}

