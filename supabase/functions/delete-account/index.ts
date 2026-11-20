import { createClient } from "npm:@supabase/supabase-js@2";

const MAX_AUTH_AGE_SECONDS = 15 * 60;
const corsHeadersFor = (origin: string | null): Record<string, string> => {
  const allowed = origin === null
    || origin === "http://localhost:3000"
    || origin === "http://127.0.0.1:5500"
    || origin === "https://swiftdictionary.pages.dev"
    || /^https:\/\/[a-z0-9-]+\.swiftdictionary\.pages\.dev$/i.test(origin)
    || /^https:\/\/[a-z0-9-]+\.swiftdictionary-testing\.pages\.dev$/i.test(origin);
  return {
    "Access-Control-Allow-Origin": allowed && origin ? origin : "null",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
};

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  cors: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  const cors = corsHeadersFor(origin);

  if (req.method === "OPTIONS") {
    if (cors["Access-Control-Allow-Origin"] === "null" && origin) {
      return new Response("Origin not allowed", { status: 403 });
    }
    return new Response("ok", { headers: cors });
  }
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405, cors);
  if (cors["Access-Control-Allow-Origin"] === "null" && origin) {
    return jsonResponse({ error: "origin_not_allowed" }, 403, cors);
  }

  const authorization = req.headers.get("authorization") || "";
  const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
  if (!tokenMatch) return jsonResponse({ error: "authentication_required" }, 401, cors);
  const accessToken = tokenMatch[1];

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "invalid_request" }, 400, cors);
  }
  if (!body || typeof body !== "object" || (body as Record<string, unknown>).confirm !== true) {
    return jsonResponse({ error: "explicit_confirmation_required" }, 400, cors);
  }

  const payload = decodeJwtPayload(accessToken);
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (!hasRecentAuthTime(payload, nowSeconds, MAX_AUTH_AGE_SECONDS)) {
    return jsonResponse({ error: "reauthentication_required", max_auth_age_seconds: MAX_AUTH_AGE_SECONDS }, 401, cors);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const publishableKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
    return jsonResponse({ error: "server_configuration_error" }, 500, cors);
  }

  const userClient = createClient(supabaseUrl, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });

  // Always derive the deletion target from the verified bearer token. Never accept a UID from the browser.
  const { data: userData, error: userError } = await userClient.auth.getUser(accessToken);
  const user = userData?.user;
  if (userError || !user?.id) return jsonResponse({ error: "invalid_or_expired_session" }, 401, cors);

  // Revoke refreshable sessions globally before deleting the account. Access JWTs
  // already issued remain usable until their exp time; the app signs out locally.
  const { error: revokeError } = await adminClient.auth.admin.signOut(accessToken, "global");
  if (revokeError) {
    return jsonResponse({ error: "session_revocation_failed", retryable: true }, 503, cors);
  }

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id, false);
  if (deleteError) {
    return jsonResponse({
      error: "deletion_failed_after_session_revocation",
      retryable: true,
      sign_in_again_required: true,
    }, 503, cors);
  }

  // Confirm Auth no longer returns the user before reporting success.
  const { data: verifyData, error: verifyError } = await adminClient.auth.admin.getUserById(user.id);
  const notFound = verifyError && (
    verifyError.status === 404
    || verifyError.code === "user_not_found"
    || /not found/i.test(verifyError.message || "")
  );
  if (verifyError && !notFound) {
    return jsonResponse({ error: "deletion_submitted_but_unverified", retryable: false }, 503, cors);
  }
  if (verifyData?.user) {
    return jsonResponse({ error: "deletion_not_confirmed", retryable: false }, 503, cors);
  }

  return jsonResponse({ success: true }, 200, cors);
});
