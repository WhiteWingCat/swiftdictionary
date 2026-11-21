// SwiftDictionary account configuration.
// Replace both values with your Supabase project's URL and anon/public key.
// Never put a service_role key or private secret in a public GitHub Pages site.
window.SWIFT_SUPABASE_CONFIG = {
  url: "https://pzymiesazmpyvnfvsbsc.supabase.co",
  anonKey: "sb_publishable_sb1pPdwMvMJ9cLgcuGzZJg_AcWA1FY4"
};

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
