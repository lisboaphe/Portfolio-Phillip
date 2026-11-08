import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { hasResumeAccess } from "@/lib/server/resume-access";

export const dynamic = "force-dynamic";

// The PDFs are never committed to the (public) repo.
// In production they come from private storage: set RESUME_PDF_URL_EN / RESUME_PDF_URL_DE
// to their storage URLs (e.g. Vercel Blob). The URLs stay on the server, never in the page.
// Locally, the files can sit in private/cv/ instead (that folder is gitignored).
const files: Record<string, { name: string; urlEnv: string }> = {
  en: { name: "phillip-lisboa-cv-en.pdf", urlEnv: "RESUME_PDF_URL_EN" },
  de: { name: "phillip-lisboa-cv-de.pdf", urlEnv: "RESUME_PDF_URL_DE" },
};

async function loadPdf({ name, urlEnv }: { name: string; urlEnv: string }) {
  const url = process.env[urlEnv];
  if (url) {
    const res = await fetch(url, { cache: "no-store" }).catch(() => null);
    return res?.ok ? new Uint8Array(await res.arrayBuffer()) : null;
  }
  return readFile(path.join(process.cwd(), "private", "cv", name))
    .then((buffer) => new Uint8Array(buffer))
    .catch(() => null);
}

/** Serves the résumé PDF only to visitors who unlocked it with the password. */
export async function GET(_request: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const file = files[lang];
  if (!file) return new NextResponse("Not found", { status: 404 });
  if (!(await hasResumeAccess())) return new NextResponse("Password required", { status: 401 });

  const pdf = await loadPdf(file);
  if (!pdf) return new NextResponse("The résumé isn’t available right now.", { status: 503, headers: { "Cache-Control": "no-store" } });

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${file.name}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
