import { NextResponse } from "next/server";
import {
  getSessionToken,
  isStatsConfigured,
  STATS_COOKIE,
  verifyPassword,
} from "@/lib/stats-auth";

export async function POST(request) {
  if (!isStatsConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Stats admin is not configured on the server." },
      { status: 503 }
    );
  }

  const body = await request.json();
  const password = String(body.password || "");

  if (!verifyPassword(password)) {
    return NextResponse.json({ ok: false, error: "Invalid password." }, { status: 401 });
  }

  const token = getSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(STATS_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
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
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
