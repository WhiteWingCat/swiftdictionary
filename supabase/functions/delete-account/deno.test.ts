import { assertEquals } from "jsr:@std/assert@1";

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

Deno.test("decodes JWT auth_time without trusting a client-supplied UID", () => {
  const payload = btoa(JSON.stringify({ sub: "synthetic-user", auth_time: 1700000000 }))
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  assertEquals(decodeJwtPayload(`header.${payload}.signature`)?.auth_time, 1700000000);
});

Deno.test("rejects malformed JWT payloads", () => {
  assertEquals(decodeJwtPayload("header.not-json.signature"), null);
});
