import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { hasResumeAccess } from "@/lib/server/resume-access";

export const dynamic = "force-dynamic";

// The PDFs are never committed to the (public) repo.
// In production they live in a *private* Vercel Blob store connected to this project,
// uploaded under exactly these file names. Vercel adds the store's credentials
// (BLOB_STORE_ID / OIDC, or BLOB_READ_WRITE_TOKEN) to the environment automatically.
// Locally, the files can sit in private/cv/ instead (that folder is gitignored).
const files: Record<string, string> = {
  en: "phillip-lisboa-cv-en.pdf",
  de: "phillip-lisboa-cv-de.pdf",
};

const blobConfigured = () => Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);

async function loadPdf(name: string): Promise<BodyInit | null> {
  if (blobConfigured()) {
    const result = await get(name, { access: "private" }).catch(() => null);
    return result?.statusCode === 200 ? result.stream : null;
  }
  return readFile(path.join(process.cwd(), "private", "cv", name))
    .then((buffer) => new Uint8Array(buffer))
    .catch(() => null);
}

/** Serves the résumé PDF only to visitors who unlocked it with the password. */
export async function GET(_request: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const name = files[lang];
  if (!name) return new NextResponse("Not found", { status: 404 });
  if (!(await hasResumeAccess())) return new NextResponse("Password required", { status: 401 });

  const pdf = await loadPdf(name);
  if (!pdf) return new NextResponse("The résumé isn’t available right now.", { status: 503, headers: { "Cache-Control": "no-store" } });

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${name}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
    },
  });
}
