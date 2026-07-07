import { NextResponse } from "next/server";
import { isStatsAuthenticated } from "@/lib/stats-auth";
import { getStatsSummary } from "@/lib/stats-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isStatsAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getStatsSummary();
    return NextResponse.json(
      { ok: true, data },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("[api/stats]", error);
    return NextResponse.json({ ok: false, error: "Failed to load stats." }, { status: 500 });
  }
}
