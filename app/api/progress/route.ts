import { getRequestStudent } from "@/lib/server/request-student";
import { getMvpStore } from "@/lib/server/sqlite";
import { NextResponse } from "next/server";

export async function GET() {
  const student = await getRequestStudent();

  if (!student) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  return NextResponse.json({
    student,
    progress: getMvpStore().getProgress(student.id)
  });
}
