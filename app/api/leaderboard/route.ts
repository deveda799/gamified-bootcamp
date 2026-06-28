import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { leaderboardPlaceholder } from "@/lib/queries/leaderboard";

export async function GET() {
  return NextResponse.json(
    apiSuccess({
      period: "total",
      me: {
        rankNo: 5,
        totalPoints: 0
      },
      items: leaderboardPlaceholder
    })
  );
}
