import {
  ADMIN_COOKIE,
  adminToken,
  isAdminTokenValid,
  sessionCookieOptions
} from "@/lib/server/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const configuredPassword = process.env.ADMIN_PASSWORD ?? "";

  if (!configuredPassword) {
    return NextResponse.json(
      { error: "服务器未配置管理员密码" },
      { status: 503 }
    );
  }

  const body = (await request.json()) as { password?: unknown };
  const suppliedPassword =
    typeof body.password === "string" ? body.password : "";
  const suppliedToken = adminToken(suppliedPassword);

  if (!isAdminTokenValid(suppliedToken, configuredPassword)) {
    return NextResponse.json({ error: "密码错误" }, { status: 401 });
  }

  (await cookies()).set(
    ADMIN_COOKIE,
    adminToken(configuredPassword),
    sessionCookieOptions
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  (await cookies()).set(ADMIN_COOKIE, "", {
    ...sessionCookieOptions,
    maxAge: 0
  });
  return NextResponse.json({ ok: true });
}
