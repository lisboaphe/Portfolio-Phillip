import { NextResponse } from "next/server";
import { safeEqual } from "@/lib/server/signing";
import { allowAttempt, clientIp } from "@/lib/server/rate-limit";
import { THOUGHTS_COOKIE, THOUGHTS_REMEMBER_SECONDS, THOUGHTS_SESSION_SECONDS, createAdminToken, isSameOrigin, isThoughtsAdmin } from "@/lib/server/thoughts-admin";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

/** Whether this browser is logged in to post thoughts. */
export async function GET() {
  return NextResponse.json({ admin: await isThoughtsAdmin() }, { headers: noStore });
}

/** Log in with THOUGHTS_PASSWORD. */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ ok: false, error: "Forbidden." }, { status: 403, headers: noStore });
  const expected = process.env.THOUGHTS_PASSWORD;
  if (!expected) return NextResponse.json({ ok: false, error: "Posting isn’t set up yet (THOUGHTS_PASSWORD is missing)." }, { status: 503, headers: noStore });

  if (!allowAttempt(`thoughts:${clientIp(request)}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Try again in 15 minutes." }, { status: 429, headers: noStore });
  }
  const body = (await request.json().catch(() => ({}))) as { password?: unknown; remember?: unknown };
  const password = String(body.password ?? "");
  // Small delay to slow down guessing.
  await new Promise((resolve) => setTimeout(resolve, 400));
  if (!safeEqual(password, expected)) return NextResponse.json({ ok: false, error: "Wrong password." }, { status: 401, headers: noStore });

  const seconds = body.remember === true ? THOUGHTS_REMEMBER_SECONDS : THOUGHTS_SESSION_SECONDS;
  const response = NextResponse.json({ ok: true }, { headers: noStore });
  response.cookies.set(THOUGHTS_COOKIE, createAdminToken(seconds), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: seconds,
  });
  return response;
}

/** Log out. */
export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ ok: false, error: "Forbidden." }, { status: 403, headers: noStore });
  const response = NextResponse.json({ ok: true }, { headers: noStore });
  response.cookies.delete(THOUGHTS_COOKIE);
  return response;
}
