import { cookies } from "next/headers";
import { createToken, readToken } from "./signing";

// Admin session for posting thoughts. This is a separate password from the
// résumé one (THOUGHTS_PASSWORD), because the résumé password gets shared.
export const THOUGHTS_COOKIE = "thoughts_admin";
export const THOUGHTS_SESSION_SECONDS = 60 * 60 * 12;
/** "Remember this device": for the installed Thoughts app on your own phone or PC. */
export const THOUGHTS_REMEMBER_SECONDS = 60 * 60 * 24 * 30;

export function createAdminToken(seconds = THOUGHTS_SESSION_SECONDS) {
  return createToken({ exp: Date.now() + seconds * 1000, scope: "thoughts-admin" });
}

export async function isThoughtsAdmin() {
  const store = await cookies();
  const data = readToken<{ exp: number; scope: string }>(store.get(THOUGHTS_COOKIE)?.value);
  return data?.scope === "thoughts-admin";
}

/** Blocks cross-site form posts: the request must come from this site's own pages. */
export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host || new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}
