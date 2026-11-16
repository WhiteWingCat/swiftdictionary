import { randomUUID } from "node:crypto";

const apiUrl = process.env.API_URL;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY;
if (!apiUrl || !serviceRoleKey) {
  throw new Error("API_URL and SERVICE_ROLE_KEY are required for local test-user creation.");
}

async function createUser(label) {
  const email = `quiz-${label}-${randomUUID()}@example.test`;
  const password = `Quiz-${randomUUID()}-Aa1!`;
  const response = await fetch(`${apiUrl}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { test_role: label } })
  });
  const body = await response.json();
  if (!response.ok || !body.id) {
    throw new Error(`Could not create synthetic ${label} user: ${JSON.stringify(body)}`);
  }
  return { id: body.id, email, password };
}

const free = await createUser("free");
const premium = await createUser("premium");
for (const [key, value] of Object.entries({
  QUIZ_FREE_USER_ID: free.id,
  QUIZ_FREE_EMAIL: free.email,
  QUIZ_FREE_PASSWORD: free.password,
  QUIZ_PREMIUM_USER_ID: premium.id,
  QUIZ_PREMIUM_EMAIL: premium.email,
  QUIZ_PREMIUM_PASSWORD: premium.password
})) {
  process.stdout.write(`${key}=${value}\n`);
}
