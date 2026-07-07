import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const STATS_COOKIE = "stats_session";

function readEnv(name) {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

function passwordDigest(value) {
  const secret = readEnv("STATS_SESSION_SECRET");
  if (!secret) return null;

  return createHmac("sha256", secret)
    .update(String(value).trim(), "utf8")
    .digest();
}

export function getSessionToken() {
  const secret = readEnv("STATS_SESSION_SECRET");
  if (!secret) return null;

  return createHmac("sha256", secret).update("stats-authenticated").digest("hex");
}

export function isStatsConfigured() {
  return Boolean(readEnv("ADMIN_STATS_PASSWORD") && readEnv("STATS_SESSION_SECRET"));
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
  const expected = readEnv("ADMIN_STATS_PASSWORD");
  const input = String(password || "").trim();
  if (!expected || !input) return false;

  const expectedDigest = passwordDigest(expected);
  const inputDigest = passwordDigest(input);
  if (!expectedDigest || !inputDigest) return false;

  try {
    return timingSafeEqual(expectedDigest, inputDigest);
  } catch {
    return false;
  }
}
