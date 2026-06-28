import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { adminOverviewPlaceholder } from "@/lib/queries/admin";

export async function GET() {
  return NextResponse.json(apiSuccess(adminOverviewPlaceholder));
}
