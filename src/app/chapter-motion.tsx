"use client";
import { useEffect } from "react";

export default function ChapterMotion() {
  useEffect(() => {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("chapter-entered");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });
    document.querySelectorAll(".home-chapters [data-chapter-motion]").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}
