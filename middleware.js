import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";

const VISITOR_COOKIE = "site_visitor_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function shouldBypass(pathname) {
  if (pathname.startsWith("/api")) return true;
  if (pathname.startsWith("/stats")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname === "/favicon.ico" || pathname === "/icon.svg") return true;
  if (/\.(png|svg|jpg|jpeg|gif|webp|ico|txt|xml)$/i.test(pathname)) return true;
  return false;
}

function resolveVisitorId(request) {
  const existing = request.cookies.get(VISITOR_COOKIE)?.value;
  if (existing) return existing;
  return crypto.randomUUID();
}

function attachVisitorCookie(response, visitorId, hadCookie) {
  if (hadCookie) return;
  response.cookies.set(VISITOR_COOKIE, visitorId, {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

async function recordRedirectVisit(request, pathname, visitorId) {
  const trackUrl = new URL("/api/track", request.url);

  await fetch(trackUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: "page_view",
      params: {
        page_path: pathname || "/",
        via: "server_redirect",
      },
      visitorId,
    }),
  });
}

export async function middleware(request, event) {
  const { pathname } = request.nextUrl;

  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  const hadCookie = Boolean(request.cookies.get(VISITOR_COOKIE)?.value);
  const visitorId = resolveVisitorId(request);
  const response = NextResponse.redirect(siteConfig.registerUrl, 302);

  attachVisitorCookie(response, visitorId, hadCookie);

  const recordTask = recordRedirectVisit(request, pathname, visitorId).catch((error) => {
    console.error("[middleware] failed to record redirect visit", error);
  });

  if (event?.waitUntil) {
    event.waitUntil(recordTask);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|stats|_next/static|_next/image|favicon.ico|icon.svg|logo.svg|.*\\.(?:png|svg|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
