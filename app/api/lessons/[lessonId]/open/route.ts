import { NextResponse } from "next/server";
import { apiError } from "@/lib/api/response";

export async function POST() {
  return NextResponse.json(
    apiError("NOT_IMPLEMENTED", "课节打开记录将在下一阶段接入 Supabase"),
    { status: 501 }
  );
}

