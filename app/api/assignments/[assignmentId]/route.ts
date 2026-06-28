import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  const { assignmentId } = await params;

  return NextResponse.json(
    apiSuccess({
      id: assignmentId,
      title: "我的价值观地图",
      descriptionMd: "写下 5 个核心价值观，并说明它们如何影响选择。",
      allowText: true,
      allowLink: true,
      allowFile: true,
      draft: null
    })
  );
}
