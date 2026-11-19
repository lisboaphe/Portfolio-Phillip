import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { del, get, list, put } from "@vercel/blob";

export type Thought = { id: string; text: string; createdAt: string };

export const THOUGHT_MAX_LENGTH = 600;
const MAX_KEPT = 200;

// In production thoughts live in the same *private* Vercel Blob store as the résumé.
// Every save writes a new, never-overwritten file (thoughts/index-<timestamp>.json)
// and removes the older ones, so a cached copy of an old file can never be served.
// Locally (no Blob credentials) they live in private/thoughts.json (gitignored).
const PREFIX = "thoughts/index-";
const localFile = path.join(process.cwd(), "private", "thoughts.json");
const blobConfigured = () => Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);

function parse(json: string): Thought[] {
  try {
    const data = JSON.parse(json) as unknown;
    return Array.isArray(data) ? (data as Thought[]).filter((t) => t && typeof t.text === "string" && typeof t.id === "string") : [];
  } catch {
    return [];
  }
}

/** All thoughts, newest first. */
export async function loadThoughts(): Promise<Thought[]> {
  if (!blobConfigured()) return parse(await readFile(localFile, "utf8").catch(() => "[]"));

  const { blobs } = await list({ prefix: PREFIX });
  const latest = blobs.map((b) => b.pathname).sort().at(-1);
  if (!latest) return [];
  const result = await get(latest, { access: "private" });
  if (!result || result.statusCode !== 200) return [];
  return parse(await new Response(result.stream).text());
}

export async function saveThoughts(thoughts: Thought[]) {
  const json = JSON.stringify(thoughts.slice(0, MAX_KEPT));
  if (!blobConfigured()) {
    await mkdir(path.dirname(localFile), { recursive: true });
    await writeFile(localFile, json, "utf8");
    return;
  }
  const pathname = `${PREFIX}${Date.now()}.json`;
  await put(pathname, json, { access: "private", contentType: "application/json", addRandomSuffix: false });
  const { blobs } = await list({ prefix: PREFIX });
  const old = blobs.filter((b) => b.pathname !== pathname).map((b) => b.url);
  if (old.length) await del(old);
}
