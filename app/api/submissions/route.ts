import { lessons } from "@/lib/mockData";
import { getRequestStudent } from "@/lib/server/request-student";
import { getMvpStore } from "@/lib/server/sqlite";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const student = await getRequestStudent();

  if (!student) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const body = (await request.json()) as {
    lessonId?: unknown;
    text?: unknown;
    link?: unknown;
  };

  if (
    typeof body.lessonId !== "string" ||
    !lessons.some((lesson) => lesson.id === body.lessonId)
  ) {
    return NextResponse.json({ error: "课程不存在" }, { status: 400 });
  }

  return NextResponse.json({
    progress: getMvpStore().submitAssignment({
      studentId: student.id,
      lessonId: body.lessonId,
      text: typeof body.text === "string" ? body.text : "",
      link: typeof body.link === "string" ? body.link : ""
    })
  });
}
