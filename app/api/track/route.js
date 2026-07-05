import { NextResponse } from "next/server";
import { recordEvent } from "@/lib/stats-store";

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

    await recordEvent(event, params, visitorId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
