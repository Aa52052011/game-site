import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const STATS_COOKIE = "stats_session";

export function getSessionToken() {
  const secret = process.env.STATS_SESSION_SECRET;
  if (!secret) return null;
  return createHmac("sha256", secret).update("stats-authenticated").digest("hex");
}

export function isStatsConfigured() {
  return Boolean(process.env.ADMIN_STATS_PASSWORD && process.env.STATS_SESSION_SECRET);
}

export async function isStatsAuthenticated() {
  const expected = getSessionToken();
  if (!expected) return false;

  const cookieStore = await cookies();
  const token = cookieStore.get(STATS_COOKIE)?.value;
  if (!token || token.length !== expected.length) return false;

  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function verifyPassword(password) {
  const expected = process.env.ADMIN_STATS_PASSWORD;
  if (!expected || !password) return false;
  if (password.length !== expected.length) return false;

  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(expected));
  } catch {
    return false;
  }
}
