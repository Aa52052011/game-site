import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const STATS_COOKIE = "stats_session";

function readEnv(name) {
  const value = process.env[name];
  if (typeof value !== "string") return "";

  return value
    .replace(/^\uFEFF/, "")
    .replace(/\r/g, "")
    .trim();
}

export function getSessionToken() {
  const secret = readEnv("STATS_SESSION_SECRET");
  if (!secret) return null;

  return createHmac("sha256", secret).update("stats-authenticated").digest("hex");
}

export function isStatsConfigured() {
  return Boolean(readEnv("ADMIN_STATS_PASSWORD") && readEnv("STATS_SESSION_SECRET"));
}

export function getStatsConfigHint() {
  const password = readEnv("ADMIN_STATS_PASSWORD");
  const sessionSecret = readEnv("STATS_SESSION_SECRET");

  return {
    configured: Boolean(password && sessionSecret),
    passwordLength: password.length,
    hasSessionSecret: Boolean(sessionSecret),
  };
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
  const input = String(password || "")
    .replace(/^\uFEFF/, "")
    .replace(/\r/g, "")
    .trim();

  if (!expected || !input) {
    return { ok: false, expectedLength: expected.length, inputLength: input.length };
  }

  const expectedBuf = Buffer.from(expected, "utf8");
  const inputBuf = Buffer.from(input, "utf8");

  if (expectedBuf.length !== inputBuf.length) {
    return { ok: false, expectedLength: expected.length, inputLength: input.length };
  }

  try {
    const ok = timingSafeEqual(expectedBuf, inputBuf);
    return { ok, expectedLength: expected.length, inputLength: input.length };
  } catch {
    return { ok: false, expectedLength: expected.length, inputLength: input.length };
  }
}
