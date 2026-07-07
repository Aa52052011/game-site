import { NextResponse } from "next/server";
import {
  getSessionToken,
  isStatsConfigured,
  STATS_COOKIE,
  verifyPassword,
} from "@/lib/stats-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  if (!isStatsConfigured()) {
    return NextResponse.json(
      { ok: false, error: "服务器尚未配置统计后台密码，请在 Vercel 环境变量中设置 ADMIN_STATS_PASSWORD 和 STATS_SESSION_SECRET。" },
      { status: 503 }
    );
  }

  const body = await request.json();
  const password = String(body.password || "");

  if (!verifyPassword(password)) {
    return NextResponse.json(
      { ok: false, error: "密码错误，请检查 Vercel 中的 ADMIN_STATS_PASSWORD 是否一致。" },
      { status: 401 }
    );
  }

  const token = getSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(STATS_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(STATS_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
