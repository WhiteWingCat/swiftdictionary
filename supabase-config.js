// SwiftDictionary account configuration.
// Cloudflare Pages preview deployments use the isolated staging project.
// Production hosts continue to use the production project.
// Publishable keys are safe for public clients; never expose service_role keys.
const SWIFT_SUPABASE_ENV = window.location.hostname.endsWith(".pages.dev")
  ? {
      url: "https://ivatvkfrtifgfheeaelj.supabase.co",
      anonKey: "sb_publishable_Etc-_5k93Dzb7glzVqvXCA_6ou7IPXo"
    }
  : {
      url: "https://pzymiesazmpyvnfvsbsc.supabase.co",
      anonKey: "sb_publishable_sb1pPdwMvMJ9cLgcuGZJg_AcWA1FY4"
    };

window.SWIFT_SUPABASE_CONFIG = SWIFT_SUPABASE_ENV;

// Preserve the anonymous saved-word collection before the app's auth refresh
// handler clears the legacy key on account changes. It is never merged into
// a signed-in account.
try {
  if (!localStorage.getItem("swiftdictionary-anonymous-saved")) {
    const legacy = localStorage.getItem("swiftdictionary-saved");
    if (legacy) localStorage.setItem("swiftdictionary-anonymous-saved", legacy);
  }
} catch {}

// account-deletion.js is loaded explicitly after the main app script in index.html.
