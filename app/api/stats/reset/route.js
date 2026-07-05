import { NextResponse } from "next/server";
import { isStatsAuthenticated } from "@/lib/stats-auth";
import { resetStats } from "@/lib/stats-store";

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

  return NextResponse.json({ ok: true });
}
