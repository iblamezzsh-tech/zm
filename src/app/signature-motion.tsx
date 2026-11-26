"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Signature from "./signature";

let heroHasPlayed = false;

export function HeroSignature() {
  const accent = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (heroHasPlayed || !accent.current) return;
    heroHasPlayed = true;
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
      accent.current.classList.add("writing");
  }, []);
  return (
    <div ref={accent} className="hero-signature">
      <Signature />
    </div>
  );
}

export function RouteSignature() {
  const path = usePathname();
  const previous = useRef(path);
  const sweep = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (previous.current === path) return;
    previous.current = path;
    const el = sweep.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (!el || reduced.matches) return;
    // Route content is already committed. The decorative layer never handles
    // focus, pointer events, or navigation, including history traversal.
    el.classList.remove("writing");
    void el.offsetWidth;
    el.classList.add("writing");
    const stop = () => el.classList.remove("writing");
    reduced.addEventListener("change", stop, { once: true });
    return () => {
      reduced.removeEventListener("change", stop);
      stop();
    };
  }, [path]);
  return (
    <div
      className="route-sweep"
      ref={sweep}
      aria-hidden="true"
      onAnimationEnd={(e) => {
        if (e.animationName === "sweep-away")
          e.currentTarget.classList.remove("writing");
      }}
    >
      <div className="route-ribbon" />
      <Signature />
    </div>
  );
}
