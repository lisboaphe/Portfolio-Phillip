import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { revalidateTag, unstable_cache } from "next/cache";
import { THOUGHT_MAX_LENGTH, loadThoughts, saveThoughts } from "@/lib/server/thoughts";
import { isSameOrigin, isThoughtsAdmin } from "@/lib/server/thoughts-admin";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };
const TAG = "thoughts";

// Cached so page views don't each hit the Blob store; refreshed whenever a thought is posted or deleted.
const cachedThoughts = unstable_cache(loadThoughts, ["thoughts"], { tags: [TAG], revalidate: 3600 });

/** Public: the latest thoughts, newest first. */
export async function GET() {
  const thoughts = await cachedThoughts().catch(() => []);
  return NextResponse.json({ thoughts: thoughts.slice(0, 30) }, { headers: noStore });
}

async function guard(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ ok: false, error: "Forbidden." }, { status: 403, headers: noStore });
  if (!(await isThoughtsAdmin())) return NextResponse.json({ ok: false, error: "Please log in again." }, { status: 401, headers: noStore });
  return null;
}

/** Admin: post a new thought. */
export async function POST(request: Request) {
  const blocked = await guard(request);
  if (blocked) return blocked;

  const body = (await request.json().catch(() => ({}))) as { text?: unknown };
  const text = String(body.text ?? "").replace(/\r\n/g, "\n").trim();
  if (!text) return NextResponse.json({ ok: false, error: "Write something first." }, { status: 400, headers: noStore });
  if (text.length > THOUGHT_MAX_LENGTH) {
    return NextResponse.json({ ok: false, error: `Keep it under ${THOUGHT_MAX_LENGTH} characters.` }, { status: 400, headers: noStore });
  }

  const thought = { id: randomUUID(), text, createdAt: new Date().toISOString() };
  await saveThoughts([thought, ...(await loadThoughts())]);
  revalidateTag(TAG);
  return NextResponse.json({ ok: true, thought }, { headers: noStore });
}

/** Admin: delete a thought by id. */
export async function DELETE(request: Request) {
  const blocked = await guard(request);
  if (blocked) return blocked;

  const id = new URL(request.url).searchParams.get("id");
  const thoughts = await loadThoughts();
  const remaining = thoughts.filter((t) => t.id !== id);
  if (remaining.length === thoughts.length) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404, headers: noStore });
  await saveThoughts(remaining);
  revalidateTag(TAG);
  return NextResponse.json({ ok: true }, { headers: noStore });
}
