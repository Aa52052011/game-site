import { NextResponse } from "next/server";
import { isStatsAuthenticated } from "@/lib/stats-auth";
import {
  getCachedStatsSummary,
  invalidateStatsCache,
  refreshStatsSummary,
} from "@/lib/stats-cache";
import { getStatsSummary } from "@/lib/stats-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!(await isStatsAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const fresh = request.nextUrl.searchParams.get("fresh") === "1";
    const data = fresh
      ? await refreshStatsSummary(() => getStatsSummary({ rebuild: true }))
      : await getCachedStatsSummary(() => getStatsSummary());

    return NextResponse.json(
      { ok: true, data },
      {
        headers: {
          "Cache-Control": "private, no-cache",
        },
      }
    );
  } catch (error) {
    console.error("[api/stats]", error);
    return NextResponse.json({ ok: false, error: "Failed to load stats." }, { status: 500 });
  }
}
