import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/server/auth";
import { getMvpStore } from "@/lib/server/sqlite";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { nickname?: unknown };

    if (typeof body.nickname !== "string") {
      return NextResponse.json({ error: "请输入昵称" }, { status: 400 });
    }

    const result = getMvpStore().loginByNickname(body.nickname);
    (await cookies()).set(
      SESSION_COOKIE,
      result.token,
      sessionCookieOptions
    );

    return NextResponse.json({ student: result.student });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "登录失败" },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value ?? "";
  getMvpStore().deleteSession(token);
  cookieStore.set(SESSION_COOKIE, "", {
    ...sessionCookieOptions,
    maxAge: 0
  });

  return NextResponse.json({ ok: true });
}
