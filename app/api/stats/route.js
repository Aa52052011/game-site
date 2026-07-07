import { NextResponse } from "next/server";
import { isStatsAuthenticated } from "@/lib/stats-auth";
import { getStatsSummary } from "@/lib/stats-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isStatsAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const data = await getStatsSummary();
  return NextResponse.json(
    { ok: true, data },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
