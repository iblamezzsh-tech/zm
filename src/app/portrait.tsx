"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Portrait({
  present,
  future,
}: {
  present: boolean;
  future: boolean;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const base = useRef<HTMLImageElement>(null);
  const overlay = useRef<HTMLImageElement>(null);
  const switcher = useRef<HTMLButtonElement>(null);
  const [ready, setReady] = useState(false);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const area = stage.current,
      layer = overlay.current,
      original = base.current,
      button = switcher.current;
    if (
      !area ||
      !layer ||
      !original ||
      !button ||
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
    function paint() {
      layer!.style.maskImage = `radial-gradient(circle at ${point.x}px ${point.y}px, black ${point.r * 0.77}px, transparent ${Math.max(0.01, point.r)}px)`;
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
      radius();
    }
    const controller = new AbortController();
    const options = { signal: controller.signal, passive: true };
    const observer = new ResizeObserver(resize);
    void Promise.all([original.decode(), layer.decode()])
      .then(() => {
        if (!alive) return;
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
  }, [present, future]);

  return (
    <section aria-label="Interactive portrait">
      {present && (
        <link rel="preload" as="image" href="/images/portrait-present.webp" />
      )}
      {future && (
        <link rel="preload" as="image" href="/images/portrait-future.webp" />
      )}
      <div className="stage" ref={stage}>
        {present ? (
          <img
            className="photo"
            ref={base}
            src="/images/portrait-present.webp"
            alt="ZiyoMuhammad in a white shirt"
            fetchPriority="high"
          />
        ) : (
          <div aria-hidden="true" className="initials">
            Zm<span>.</span>
          </div>
        )}
        {future && (
          <img
            className="photo mask"
            ref={overlay}
            src="/images/portrait-future.webp"
            alt=""
            aria-hidden="true"
          />
        )}
        <div className="plate">
          <span className="plate-line" />
          Personal portrait
        </div>
        <div className="caption">
          <div className="eyebrow">{pinned ? "Future" : "Present"}</div>
          <h2>
            {pinned ? (
              <>
                Who I aspire
                <br />
                <em>to become.</em>
              </>
            ) : (
              <>
                Who
                <br />
                <em>I am.</em>
              </>
            )}
          </h2>
        </div>
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
              <span className="mouse-hint">Move your cursor to explore</span>
              <span className="touch-hint">Touch and drag to explore</span>
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
          aria-label="Show future portrait"
        >
          <span className={!pinned ? "selected" : ""}>Present</span>
          <span className={pinned ? "selected" : ""}>Future</span>
        </button>
      </div>
    </section>
  );
}
