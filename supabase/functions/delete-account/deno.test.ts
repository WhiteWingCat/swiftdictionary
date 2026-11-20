function assertEquals(actual: unknown, expected: unknown, message: string) {
  if (actual !== expected) throw new Error(message + `: expected ${expected}, received ${actual}`);
}
function decodeJwtPayload(token: string): Record<string, unknown> | null {
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
Deno.test("decodes auth_time from a JWT payload", () => {
  const payload = btoa(JSON.stringify({ sub: "synthetic-user", auth_time: 1700000000 }))
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  assertEquals(decodeJwtPayload(`header.${payload}.signature`)?.auth_time, 1700000000, "auth_time must be read");
});
Deno.test("rejects malformed JWT payloads", () => {
  assertEquals(decodeJwtPayload("header.not-json.signature"), null, "malformed token must fail closed");
});
Deno.test("rejects tokens without an auth_time claim", () => {
  const payload = btoa(JSON.stringify({ sub: "synthetic-user" })).replace(/=/g, "");
  assertEquals(decodeJwtPayload(`header.${payload}.signature`)?.auth_time, undefined, "missing auth_time must remain missing");
});
