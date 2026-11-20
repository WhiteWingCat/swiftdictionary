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

export function hasRecentAuthTime(
  payload: Record<string, unknown> | null,
  nowSeconds: number,
  maxAgeSeconds = MAX_AUTH_AGE_SECONDS,
): boolean {
  const authTime = Number(payload?.auth_time);
  return Number.isFinite(authTime)
    && authTime > 0
    && authTime <= nowSeconds + 60
    && nowSeconds - authTime <= maxAgeSeconds;
}

export function isAllowedOrigin(origin: string | null): boolean {
  return origin === null
    || origin === "http://localhost:3000"
    || origin === "http://127.0.0.1:5500"
    || origin === "https://swiftdictionary.pages.dev"
    || /^https:\/\/[a-z0-9-]+\.swiftdictionary\.pages\.dev$/i.test(origin)
    || /^https:\/\/[a-z0-9-]+\.swiftdictionary-testing\.pages\.dev$/i.test(origin);
}
