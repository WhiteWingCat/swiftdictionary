import { decodeJwtPayload, hasRecentAuthentication, isAllowedOrigin, MAX_AUTH_AGE_SECONDS } from "./security.ts";

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

Deno.test("decodes a JWT AMR claim with its authentication timestamp", () => {
  const payload = decodeJwtPayload(tokenWithPayload({
    sub: "synthetic-user",
    amr: [{ method: "oauth", timestamp: 1700000000 }],
  }));
  assert(Array.isArray(payload?.amr), "AMR should be decoded");
});

Deno.test("rejects malformed and missing JWT payloads", () => {
  assert(decodeJwtPayload("header.not-json.signature") === null, "malformed payload must fail closed");
  assert(decodeJwtPayload("missing-payload") === null, "missing payload must fail closed");
});

Deno.test("accepts only interactive authentication within the 15-minute window", () => {
  const now = 1700001000;
  assert(hasRecentAuthentication({ amr: [{ method: "oauth", timestamp: now - 899 }] }, now), "899-second-old OAuth should pass");
  assert(hasRecentAuthentication({ amr: [{ method: "oauth", timestamp: now }] }, now), "current OAuth should pass");
  assert(!hasRecentAuthentication({ amr: [{ method: "oauth", timestamp: now - 901 }] }, now), "stale OAuth should fail");
  assert(!hasRecentAuthentication({ amr: [{ method: "token_refresh", timestamp: now }] }, now), "token refresh must not count as fresh authentication");
  assert(!hasRecentAuthentication({ amr: [{ method: "oauth", timestamp: now + 61 }] }, now), "future timestamp should fail");
  assert(!hasRecentAuthentication({ amr: [] }, now), "empty AMR should fail");
  assert(!hasRecentAuthentication({ auth_time: now }, now), "OIDC auth_time alone should fail closed");
  assert(!hasRecentAuthentication(null, now), "missing payload should fail");
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
