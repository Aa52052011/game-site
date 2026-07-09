const CACHE_TTL_MS = 60_000;

/** @type {{ data: Awaited<ReturnType<typeof import("@/lib/stats-store").getStatsSummary>>; expiresAt: number } | null} */
let cache = null;

export async function getCachedStatsSummary(fetcher) {
  const now = Date.now();

  if (cache && now < cache.expiresAt) {
    return cache.data;
  }

  return refreshStatsSummary(fetcher);
}

export async function refreshStatsSummary(fetcher) {
  const data = await fetcher();
  cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
  return data;
}

export function invalidateStatsCache() {
  cache = null;
}
