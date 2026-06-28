import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  return NextResponse.json(
    apiSuccess({
      id: userId,
      nickname: "Jenny",
      totalPoints: 0,
      levelName: "觉醒者",
      checkInDays: 0,
      completedLessons: 0,
      submittedAssignments: 0,
      badgesCount: 0
    })
  );
}
