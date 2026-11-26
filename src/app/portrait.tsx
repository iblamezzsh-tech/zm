"use client";
import { useEffect, useRef, useState } from "react";
import { HeroSignature } from "./signature-motion";
import { gsap } from "gsap";

export default function Portrait() {
  const stage = useRef<HTMLDivElement>(null);
  const base = useRef<HTMLImageElement>(null);
  const overlay = useRef<HTMLImageElement>(null);
  const lens = useRef<HTMLDivElement>(null);
  const switcher = useRef<HTMLButtonElement>(null);
  const [ready, setReady] = useState(false);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const area = stage.current,
      layer = overlay.current,
      original = base.current,
      button = switcher.current,
      aperture = lens.current;
    if (
      !area ||
      !layer ||
      !original ||
      !button ||
      !aperture ||
      !CSS.supports("mask-image", "radial-gradient(black, transparent)")
    )
      return;
    let alive = true,
      full = false,
      inside = false,
      touch: number | null = null;
    let bounds = area.getBoundingClientRect();
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const point = { x: bounds.width / 2, y: bounds.height / 2, r: 0 };
    // Translate a static feathered mask and counter-transform the photo so
    // its pixels stay registered to the base image. Only transforms animate.
    const diameter = 400;
    function paint() {
      if (!point.r) {
        aperture!.style.visibility = "hidden";
        return;
      }
      const scale = (point.r * 2) / diameter;
      const left = point.x - point.r;
      const top = point.y - point.r;
      aperture!.style.visibility = "visible";
      aperture!.style.transform = `translate3d(${left}px,${top}px,0) scale(${scale})`;
      layer!.style.transform = `scale(${1 / scale}) translate3d(${-left}px,${-top}px,0)`;
    }
    const opts = { duration: 0.24, ease: "power3.out", onUpdate: paint };
    const xTo = gsap.quickTo(point, "x", opts),
      yTo = gsap.quickTo(point, "y", opts);
    const rTo = gsap.quickTo(point, "r", { ...opts, duration: 0.48 });
    function radius() {
      const r = full
        ? Math.hypot(bounds.width, bounds.height) / 0.76
        : inside
          ? Math.max(96, Math.min(bounds.width * 0.27, bounds.height * 0.49))
          : 0;
      if (motion.matches) {
        xTo.tween.pause();
        yTo.tween.pause();
        rTo.tween.pause();
        point.r = r;
        paint();
      } else rTo(r);
    }
    function track(e: PointerEvent) {
      if (full || (e.pointerType !== "mouse" && touch !== e.pointerId)) return;
      const x = e.clientX - bounds.left,
        y = e.clientY - bounds.top;
      if (!inside || motion.matches) {
        point.x = x;
        point.y = y;
        paint();
      } else {
        xTo(x);
        yTo(y);
      }
      if (!inside) {
        inside = true;
        radius();
      }
    }
    function enter(e: PointerEvent) {
      bounds = area!.getBoundingClientRect();
      track(e);
    }
    function leave() {
      inside = false;
      radius();
    }
    function down(e: PointerEvent) {
      if (!e.isPrimary || e.pointerType === "mouse") return;
      touch = e.pointerId;
      area!.setPointerCapture(e.pointerId);
      enter(e);
    }
    function up(e: PointerEvent) {
      if (e.pointerId === touch) {
        touch = null;
        leave();
      }
    }
    function toggle() {
      full = !full;
      inside = false;
      setPinned(full);
      radius();
    }
    function resize() {
      bounds = area!.getBoundingClientRect();
      layer!.style.width = bounds.width + "px";
      layer!.style.height = bounds.height + "px";
      radius();
    }
    const controller = new AbortController();
    const options = { signal: controller.signal, passive: true };
    const observer = new ResizeObserver(resize);
    void Promise.all([original.decode(), layer.decode()])
      .then(() => {
        if (!alive) return;
        resize();
        paint();
        setReady(true);
        area.addEventListener("pointerenter", enter, options);
        area.addEventListener("pointermove", track, options);
        area.addEventListener("pointerleave", leave, options);
        area.addEventListener("pointerdown", down, options);
        area.addEventListener("pointerup", up, options);
        area.addEventListener("pointercancel", up, options);
        window.addEventListener("scroll", resize, {
          ...options,
          capture: true,
        });
        button.addEventListener("click", toggle, options);
        motion.addEventListener("change", radius, options);
        observer.observe(area);
      })
      .catch(() => {
        /* The original remains readable if the second image fails. */
      });
    return () => {
      alive = false;
      controller.abort();
      observer.disconnect();
      gsap.killTweensOf(point);
    };
  }, []);

  return (
    <section aria-label="Interactive portrait">
      <link rel="preload" as="image" href="/images/portrait-present.webp" />
      <link rel="preload" as="image" href="/images/portrait-future.webp" />
      <div className="stage hero-composition" ref={stage}>
        <h1 className="hero-name" aria-label="ZiyoMuhammad">
          <svg viewBox="0 0 1200 164" role="presentation" aria-hidden="true">
            <text x="10" y="124" textLength="1180" lengthAdjust="spacingAndGlyphs">ZiyoMuhammad</text>
          </svg>
        </h1>
        <img
          className="photo"
          ref={base}
          src="/images/portrait-present.webp"
          alt="ZiyoMuhammad in a white shirt"
          fetchPriority="high"
        />
        <div className="lens" ref={lens} aria-hidden="true">
          <img
            className="photo future-photo"
            ref={overlay}
            src="/images/portrait-future.webp"
            alt=""
            aria-hidden="true"
          />
        </div>
        <div className="plate">
          <span className="plate-line" />
          Portrait / 01
        </div>
        <div className="caption">
          <div className="eyebrow">{pinned ? "02 / The future" : "01 / The present"}</div>
          <h2>
            {pinned ? (
              <>
                Who I aspire
                <br />
                <em>to become.</em>
              </>
            ) : (
              <>
                Curious by
                <br />
                <em>nature.</em>
              </>
            )}
          </h2>
        </div>
        <aside className="hero-note" aria-label="Personal introduction">
          <span>Uzbekistan</span>
          <p>Student. Founder.<br />Always learning.</p>
        </aside>
        <HeroSignature />
        <a className="hero-scroll" href="#introduction"><span aria-hidden="true">↓</span> Scroll to discover</a>
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />
      </div>
      <div className="toolbar">
        <div className="hint">
          {ready ? (
            <>
              <span className="cross" aria-hidden="true">
                ⌖
              </span>
              <span className="mouse-hint">Move across the portrait to reveal the future</span>
              <span className="touch-hint">Touch and drag to reveal the future</span>
            </>
          ) : (
            <span>Personal portrait of ZiyoMuhammad</span>
          )}
        </div>
        <button
          hidden={!ready}
          ref={switcher}
          className="switch"
          aria-pressed={pinned}
          aria-label={pinned ? "Show present portrait" : "Show future portrait"}
        >
          <span className={!pinned ? "selected" : ""}>Present</span>
          <span className={pinned ? "selected" : ""}>Future</span>
        </button>
      </div>
    </section>
  );
}
