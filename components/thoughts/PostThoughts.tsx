"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { formatThoughtDate, type Thought } from "./format";

const MAX = 600;

// Opens LinkedIn's post box with the thought filled in. The text is also copied,
// because LinkedIn's app on phones doesn't always take over the pre-filled text.
const linkedInUrl = (text: string) => `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
const copyText = (text: string) => { navigator.clipboard?.writeText(text).catch(() => undefined); };

function ShareOnLinkedIn({ text, compact = false }: { text: string; compact?: boolean }) {
  return (
    <a className={compact ? "admin-linkedin is-compact" : "admin-linkedin"} href={linkedInUrl(text)} target="_blank" rel="noopener noreferrer" onClick={() => copyText(text)}>
      {compact ? "LinkedIn ↗" : "Share on LinkedIn ↗"}
    </a>
  );
}
type State = "checking" | "locked" | "admin";

export function PostThoughts() {
  const [state, setState] = useState<State>("checking");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [text, setText] = useState("");
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [lastPosted, setLastPosted] = useState("");
  const [busy, setBusy] = useState(false);

  const loadThoughts = useCallback(async () => {
    const data = (await fetch("/api/thoughts", { cache: "no-store" }).then((r) => r.json()).catch(() => ({ thoughts: [] }))) as { thoughts: Thought[] };
    setThoughts(data.thoughts ?? []);
  }, []);

  useEffect(() => {
    fetch("/api/thoughts/session", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { admin?: boolean }) => setState(d.admin ? "admin" : "locked"))
      .catch(() => setState("locked"));
  }, []);

  useEffect(() => {
    if (state === "admin") void loadThoughts();
  }, [state, loadThoughts]);

  const send = async (url: string, method: string, body?: unknown) => {
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; thought?: Thought };
    if (res.status === 401 && url !== "/api/thoughts/session") setState("locked");
    return data;
  };

  const login = async (event: FormEvent) => {
    event.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError("");
    const data = await send("/api/thoughts/session", "POST", { password, remember }).catch(() => ({ ok: false, error: "Something went wrong." }));
    setBusy(false);
    if (data.ok) {
      setPassword("");
      setState("admin");
    } else setError(data.error || "Wrong password.");
  };

  const post = async (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    setLastPosted("");
    const data = await send("/api/thoughts", "POST", { text }).catch(() => ({ ok: false, error: "Something went wrong." }));
    setBusy(false);
    if (data.ok) {
      setLastPosted(("thought" in data && data.thought?.text) || text.trim());
      setText("");
      setNotice("Posted. It’s live on your homepage.");
      void loadThoughts();
    } else setError(data.error || "Couldn’t post that.");
  };

  const remove = async (id: string) => {
    if (busy || !confirm("Delete this thought?")) return;
    setBusy(true);
    const data = await send(`/api/thoughts?id=${encodeURIComponent(id)}`, "DELETE").catch(() => ({ ok: false, error: "Something went wrong." }));
    setBusy(false);
    if (data.ok) void loadThoughts();
    else setError(data.error || "Couldn’t delete that.");
  };

  const logout = async () => {
    await send("/api/thoughts/session", "DELETE").catch(() => null);
    setState("locked");
  };

  return (
    <main className="admin-page">
      <div className="admin-card">
        <p className="eyebrow">Thoughts</p>
        <h1>{state === "admin" ? "What’s on your mind?" : "Log in to post"}</h1>

        {state === "checking" && <p className="admin-muted">Checking…</p>}

        {state === "locked" && (
          <form onSubmit={login} className="admin-form">
            <label htmlFor="thoughts-password">Password</label>
            <input id="thoughts-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
            <label className="admin-check"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember this device for 30 days</label>
            <button type="submit" disabled={busy || !password}>{busy ? "Checking…" : "Log in"}</button>
          </form>
        )}

        {state === "admin" && (
          <>
            <form onSubmit={post} className="admin-form">
              <label htmlFor="thought-text" className="sr-only">Your thought</label>
              <textarea id="thought-text" rows={5} maxLength={MAX} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a thought…" autoFocus onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); e.currentTarget.form?.requestSubmit(); }
              }} />
              <div className="admin-row">
                <span className="admin-muted">{text.length}/{MAX} · Ctrl+Enter to post</span>
                <button type="submit" disabled={busy || !text.trim()}>{busy ? "Posting…" : "Post"}</button>
              </div>
            </form>
            {notice && (
              <div className="admin-posted" role="status">
                <p className="admin-notice">{notice}</p>
                {lastPosted && (
                  <>
                    <ShareOnLinkedIn text={lastPosted} />
                    <p className="admin-muted">Opens LinkedIn with your thought filled in. It’s copied too, so you can paste it if LinkedIn doesn’t.</p>
                  </>
                )}
              </div>
            )}
          </>
        )}

        {error && <p className="admin-error" role="alert">{error}</p>}

        {state === "admin" && (
          <>
            <h2>Posted</h2>
            {thoughts.length === 0 ? <p className="admin-muted">Nothing yet.</p> : (
              <ul className="admin-list">
                {thoughts.map((t) => (
                  <li key={t.id}>
                    <p>{t.text}</p>
                    <div className="admin-row">
                      <time className="admin-muted" dateTime={t.createdAt}>{formatThoughtDate(t.createdAt)}</time>
                      <span className="admin-actions">
                        <ShareOnLinkedIn text={t.text} compact />
                        <button type="button" className="admin-delete" onClick={() => remove(t.id)} disabled={busy}>Delete</button>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="admin-row admin-footer">
              <a href="/">← Back to the site</a>
              <button type="button" className="admin-link" onClick={logout}>Log out</button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
