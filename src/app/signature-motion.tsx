"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { resetScrollMomentum, requestMotionFrame } from "./motion-clock";
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
  useLayoutEffect(() => {
    resetScrollMomentum();
    requestMotionFrame();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const content = document.querySelector("main h1");
    if (!content || path === "/") return;
    const frames = path.startsWith("/projects")
      ? [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0)" }]
      : path === "/contact"
        ? [
            { transform: "perspective(900px) rotateX(-9deg)" },
            { transform: "none" },
          ]
        : [
            { letterSpacing: "-.075em" },
            { letterSpacing: getComputedStyle(content).letterSpacing },
          ];
    const animation = content.animate(frames, {
      duration: 460,
      easing: "cubic-bezier(.17,.72,.25,1)",
    });
    return () => animation.cancel();
  }, [path]);
  return null;
}
