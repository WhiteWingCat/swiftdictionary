import { decodeJwtPayload, hasRecentAuthTime, isAllowedOrigin, MAX_AUTH_AGE_SECONDS } from "./security.ts";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function tokenWithPayload(payload: Record<string, unknown>): string {
  const encoded = btoa(JSON.stringify(payload))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `header.${encoded}.signature`;
}

Deno.test("decodes a JWT auth_time claim", () => {
  const payload = decodeJwtPayload(tokenWithPayload({ sub: "synthetic-user", auth_time: 1700000000 }));
  assert(payload?.auth_time === 1700000000, "auth_time should be decoded");
});

Deno.test("rejects malformed and missing JWT payloads", () => {
  assert(decodeJwtPayload("header.not-json.signature") === null, "malformed payload must fail closed");
  assert(decodeJwtPayload("missing-payload") === null, "missing payload must fail closed");
});

Deno.test("accepts only authentication within the 15-minute window", () => {
  const now = 1700001000;
  assert(hasRecentAuthTime({ auth_time: now - 899 }, now), "899-second-old auth should pass");
  assert(hasRecentAuthTime({ auth_time: now }, now), "current auth should pass");
  assert(!hasRecentAuthTime({ auth_time: now - 901 }, now), "stale auth should fail");
  assert(!hasRecentAuthTime({ auth_time: 0 }, now), "zero auth_time should fail");
  assert(!hasRecentAuthTime({ auth_time: now + 61 }, now), "future auth_time should fail");
  assert(!hasRecentAuthTime(null, now), "missing auth payload should fail");
  assert(MAX_AUTH_AGE_SECONDS === 900, "max age should remain 15 minutes");
});

Deno.test("allows only SwiftDictionary Pages origins and local development", () => {
  assert(isAllowedOrigin("https://feature-update-2-6-0-legal-p.swiftdictionary.pages.dev"), "feature Pages origin");
  assert(isAllowedOrigin("https://feature-update-2-6-0.swiftdictionary-testing.pages.dev"), "testing Pages origin");
  assert(isAllowedOrigin("https://swiftdictionary.pages.dev"), "production Pages origin");
  assert(isAllowedOrigin("http://localhost:3000"), "local development origin");
  assert(!isAllowedOrigin("https://attacker.example"), "untrusted origin must fail");
  assert(!isAllowedOrigin("https://swiftdictionary.pages.dev.attacker.example"), "suffix spoof must fail");
});
