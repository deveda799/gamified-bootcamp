import { NextResponse } from "next/server";
import { apiError } from "@/lib/api/response";

export async function POST() {
  return NextResponse.json(
    apiError("NOT_IMPLEMENTED", "附件上传将在下一阶段接入 Supabase Storage"),
    { status: 501 }
  );
}

