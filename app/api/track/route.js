import { NextResponse } from "next/server";
import { recordEvent } from "@/lib/stats-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    let body;
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      const text = await request.text();
      body = text ? JSON.parse(text) : {};
    }

    const event = String(body.event || "");
    const params = body.params && typeof body.params === "object" ? body.params : {};
    const visitorId = body.visitorId ? String(body.visitorId) : null;

    if (!event || event.length > 64) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const result = await recordEvent(event, params, visitorId);
    if (!result.ok) {
      if (result.reason === "not_configured") {
        return NextResponse.json(
          {
            ok: false,
            error: "Stats storage is not configured.",
            hint: "Connect a Vercel Blob Store to this project and redeploy.",
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          ok: false,
          error: "Failed to save event.",
          detail: result.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/track]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
