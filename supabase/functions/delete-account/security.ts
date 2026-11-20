export const MAX_AUTH_AGE_SECONDS = 15 * 60;

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;
    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

/**
 * Supabase access tokens carry authentication freshness in the AMR claim.
 * auth_time is an OIDC ID-token claim and is not a standard Supabase
 * access-token claim. Ignore token_refresh entries: refreshing a token must
 * never make an old interactive sign-in appear recent.
 */
export function hasRecentAuthentication(
  payload: Record<string, unknown> | null,
  nowSeconds: number,
  maxAgeSeconds = MAX_AUTH_AGE_SECONDS,
): boolean {
  const amr = payload?.amr;
  if (!Array.isArray(amr) || amr.length === 0) return false;

  const authenticationTimes = amr
    .filter((entry): entry is Record<string, unknown> =>
      !!entry && typeof entry === "object" && entry.method !== "token_refresh")
    .map((entry) => Number(entry.timestamp))
    .filter((timestamp) =>
      Number.isSafeInteger(timestamp)
      && timestamp > 0
      && timestamp <= nowSeconds + 60);

  if (authenticationTimes.length === 0) return false;
  const latestAuthentication = Math.max(...authenticationTimes);
  return nowSeconds - latestAuthentication <= maxAgeSeconds;
}

export function isAllowedOrigin(origin: string | null): boolean {
  return origin === null
    || origin === "http://localhost:3000"
    || origin === "http://127.0.0.1:5500"
    || origin === "https://swiftdictionary.pages.dev"
    || /^https:\/\/[a-z0-9-]+\.swiftdictionary\.pages\.dev$/i.test(origin)
    || /^https:\/\/[a-z0-9-]+\.swiftdictionary-testing\.pages\.dev$/i.test(origin);
}
