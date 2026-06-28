import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { calculateCurrentLevel } from "@/lib/domain/levels";

export async function GET() {
  const totalPoints = 0;
  const level = calculateCurrentLevel(totalPoints);

  return NextResponse.json(
    apiSuccess({
      totalPoints,
      ...level,
      badgesCount: 0,
      checkInDays: 0,
      completedLessons: 0,
      submittedAssignments: 0
    })
  );
}
