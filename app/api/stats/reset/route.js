import { NextResponse } from "next/server";
import { isStatsAuthenticated } from "@/lib/stats-auth";
import { invalidateStatsCache } from "@/lib/stats-cache";
import { resetStats } from "@/lib/stats-store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  if (!(await isStatsAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const cleared = await resetStats();
  if (!cleared) {
    return NextResponse.json(
      { ok: false, error: "Blob storage is not configured." },
      { status: 503 }
    );
  }

  invalidateStatsCache();

  return NextResponse.json({ ok: true });}
