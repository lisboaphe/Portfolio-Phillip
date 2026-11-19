"use client";

import { useEffect, useState } from "react";
import { formatThoughtDate, type Thought } from "./format";

/** The homepage tile's feed: latest thought first, older ones below (scrolls inside the tile). */
export function ThoughtsFeed() {
  const [thoughts, setThoughts] = useState<Thought[] | null>(null);

  useEffect(() => {
    fetch("/api/thoughts", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { thoughts?: Thought[] }) => setThoughts(d.thoughts ?? []))
      .catch(() => setThoughts([]));
  }, []);

  return (
    <>
      <p className="eyebrow thoughts-title">Thoughts</p>
      <div className="thoughts-feed" tabIndex={0} aria-label="Phillip’s thoughts" aria-busy={thoughts === null}>
        {thoughts === null ? (
          <div className="thought-skeleton" aria-hidden="true"><span /><span /><span /></div>
        ) : thoughts.length === 0 ? (
          <p className="thoughts-empty">Nothing here yet. Check back soon.</p>
        ) : (
          thoughts.map((t, i) => (
            <article key={t.id} className={`thought ${i === 0 ? "is-latest" : ""}`}>
              <p>{t.text}</p>
              <time dateTime={t.createdAt}>{formatThoughtDate(t.createdAt)}</time>
            </article>
          ))
        )}
      </div>
      <img src="/chibi/phillip.webp" width={720} height={758} alt="" className="thoughts-chibi" />
    </>
  );
}
