"use client";

import { useEffect, useRef, useState } from "react";
import { projectsByDate as projects } from "@/data/portfolio-content";

export function ProjectCarousel({ onOpen }: { onOpen: (button: HTMLButtonElement, slug: string) => void }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  // Slide a click is heading to, so quick repeated clicks add up during the scroll.
  const pending = useRef<number | null>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      const i = Math.round(el.scrollLeft / Math.max(el.clientWidth, 1));
      setIndex(i);
      if (pending.current === i) pending.current = null;
    };
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, []);

  const go = (target: number) => {
    const el = track.current;
    if (!el) return;
    const next = Math.max(0, Math.min(projects.length - 1, target));
    pending.current = next;
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: next * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <section className="project-carousel" aria-roledescription="carousel" aria-label="Projects">
      <div className="carousel-track" ref={track} onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); go((pending.current ?? index) + 1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); go((pending.current ?? index) - 1); }
      }}>
        {projects.map((project, i) => {
          const image = project.images[0];
          return (
            <article className="carousel-slide" key={project.title} aria-roledescription="slide" aria-label={`${i + 1} of ${projects.length}: ${project.title}`}>
              <div className={`carousel-shot ${image.height > image.width ? "is-tall" : ""}`}>
                <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading={i === 0 ? "eager" : "lazy"} decoding="async" />
              </div>
              <div className="carousel-info">
                <p className="eyebrow">{i === 0 ? "Latest project" : project.category} · {project.status}</p>
                <h2>{project.title}</h2>
                <p className="carousel-summary">{project.summary}</p>
                <ul className="carousel-tags">
                  {project.tags.slice(0, 4).map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                <div className="carousel-actions">
                  <button type="button" tabIndex={i === index ? 0 : -1} onClick={(e) => onOpen(e.currentTarget, project.slug)}>View project</button>
                  <a href={project.href} target="_blank" rel="noopener noreferrer" tabIndex={i === index ? 0 : -1}>GitHub ↗</a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <div className="carousel-controls">
        <button type="button" className="carousel-arrow" aria-label="Previous project" disabled={index === 0} onClick={() => go((pending.current ?? index) - 1)}>‹</button>
        <div className="carousel-dots">
          {projects.map((project, i) => (
            <button type="button" key={project.title} aria-label={`Show ${project.title}`} aria-current={i === index} className={i === index ? "is-active" : ""} onClick={() => go(i)} />
          ))}
        </div>
        <button type="button" className="carousel-arrow" aria-label="Next project" disabled={index === projects.length - 1} onClick={() => go((pending.current ?? index) + 1)}>›</button>
      </div>
    </section>
  );
}
