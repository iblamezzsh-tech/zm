"use client";
import { useEffect, useRef, useState } from "react";
import { HeroSignature } from "./signature-motion";
import { gsap } from "gsap";
import "./hero-atmosphere.css";
import ContourField from "./contour-field";

export default function Portrait() {
  const stage = useRef<HTMLDivElement>(null);
  const base = useRef<HTMLImageElement>(null);
  const overlay = useRef<HTMLImageElement>(null);
  const lens = useRef<HTMLDivElement>(null);
  const switcher = useRef<HTMLButtonElement>(null);
  const pauseButton = useRef<HTMLButtonElement>(null);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const area = stage.current,
      layer = overlay.current,
      original = base.current,
      button = switcher.current,
      aperture = lens.current,
      pause = pauseButton.current;
    if (
      !area ||
      !layer ||
      !original ||
      !button ||
      !aperture ||
      !pause ||
      !CSS.supports("mask-image", "radial-gradient(black, transparent)")
    )
      return;
    let alive = true,
      full = false,
      inside = false,
      touch: number | null = null;
    let stopped = false, interacted = false, demonstrated = false;
    let demo: gsap.core.Timeline | null = null;
    const depth = { x: 0, y: 0 };
    let bounds = area.getBoundingClientRect();
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const point = { x: bounds.width / 2, y: bounds.height / 2, r: 0 };
    // The overlay contains only academic attire; the original face stays on the base layer.
    // Translate a static feathered mask and counter-transform the photo so
    // its pixels stay registered to the base image. Only transforms animate.
    const diameter = 400;
    function paint() {
      if (!point.r) {
        aperture!.style.visibility = "hidden";
        return;
      }
      const scale = (point.r * 2) / diameter;
      const left = point.x - depth.x - point.r;
      const top = point.y - depth.y - point.r;
      aperture!.style.visibility = "visible";
      aperture!.style.transform = `translate3d(${left}px,${top}px,0) scale(${scale})`;
      layer!.style.transform = `scale(${1 / scale}) translate3d(${-left}px,${-top}px,0)`;
    }
    function paintDepth() {
      area!.style.setProperty("--hero-dx", depth.x+"px");
      area!.style.setProperty("--hero-dy", depth.y+"px");
      paint();
    }
    const depthOptions = {duration: .65, ease:"power3.out", onUpdate:paintDepth};
    const dxTo = gsap.quickTo(depth,"x",depthOptions), dyTo = gsap.quickTo(depth,"y",depthOptions);
    function resetDepth(immediate=false) {
      if(immediate){dxTo.tween.pause();dyTo.tween.pause();depth.x=0;depth.y=0;paintDepth()}
      else{dxTo(0);dyTo(0)}
    }
    function cancelDemo() {
      if(!demo)return;
      demo.kill();demo=null;point.r=0;paint();
    }
    function demonstrate() {
      if(demonstrated||interacted||stopped||motion.matches||full||document.hidden)return;
      demonstrated=true;
      point.x=bounds.width*.44;point.y=bounds.height*.18;point.r=0;
      const revealRadius=Math.max(100,Math.min(bounds.width*.19,bounds.height*.34));
      demo=gsap.timeline({delay:1.05,onUpdate:paint,onComplete:()=>{demo=null;point.r=0;paint()}});
      demo.to(point,{r:revealRadius,duration:.7,ease:"power2.inOut"})
        .to(point,{x:bounds.width*.57,y:bounds.height*.31,duration:1.35,ease:"sine.inOut"})
        .to(point,{r:0,duration:.65,ease:"power2.inOut"});
    }
    function motionChanged() {
      if(motion.matches||stopped){cancelDemo();resetDepth(true)}
      radius();
    }
    function toggleMotion(){
      stopped=!stopped;setPaused(stopped);
      if(stopped){interacted=true;cancelDemo();resetDepth(true);xTo.tween.pause();yTo.tween.pause();rTo.tween.pause()}
      radius();
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
      if (motion.matches || stopped) {
        xTo.tween.pause();
        yTo.tween.pause();
        rTo.tween.pause();
        point.r = r;
        paint();
      } else rTo(r);
    }
    function track(e: PointerEvent) {
      if (e.pointerType !== "mouse" && touch !== e.pointerId) return;
      interacted=true;cancelDemo();
      const x = e.clientX - bounds.left,
        y = e.clientY - bounds.top;
      if(e.pointerType==="mouse"&&!motion.matches&&!stopped){
        dxTo(Math.max(-1,Math.min(1,x/Math.max(1,bounds.width)*2-1))*13);
        dyTo(Math.max(-1,Math.min(1,y/Math.max(1,bounds.height)*2-1))*6);
      }
      if(full)return;
      if (!inside || motion.matches || stopped) {
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
      resetDepth(motion.matches||stopped);
      inside = false;
      radius();
    }
    function down(e: PointerEvent) {
      if (!e.isPrimary || e.pointerType === "mouse" || (e.target instanceof Element && e.target.closest("a, button"))) return;
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
      interacted=true;cancelDemo();
      full = !full;
      inside = false;
      setPinned(full);
      radius();
    }
    function refreshBounds() {
      bounds = area!.getBoundingClientRect();
    }
    function resize() {
      refreshBounds();
      layer!.style.width = bounds.width + "px";
      layer!.style.height = bounds.height + "px";
      radius();
    }
    const controller = new AbortController();
    const options = { signal: controller.signal, passive: true };
    const observer = new ResizeObserver(resize);
    const visibility = new IntersectionObserver(entries=>{
      const visible=entries[0]?.isIntersecting??false;
      area.classList.toggle("hero-in-view",visible);
      if(visible)demonstrate();else{cancelDemo();resetDepth(true)}
    },{threshold:.2});
    function documentVisibility(){area!.classList.toggle("hero-tab-hidden",document.hidden);if(document.hidden){cancelDemo();resetDepth(true)}}
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
        area.addEventListener("lostpointercapture", up, options);
        window.addEventListener("scroll", refreshBounds, {
          ...options,
          capture: true,
        });
        button.addEventListener("click", toggle, options);
        motion.addEventListener("change", motionChanged, options);
        pause.addEventListener("click",toggleMotion,options);
        document.addEventListener("visibilitychange",documentVisibility,options);
        documentVisibility();
        observer.observe(area);
        visibility.observe(area);
      })
      .catch(() => {
        /* The original remains readable if the second image fails. */
      });
    return () => {
      alive = false;
      controller.abort();
      observer.disconnect();
      visibility.disconnect();
      cancelDemo();
      gsap.killTweensOf(point);
      gsap.killTweensOf(depth);
    };
  }, []);

  return (
    <section aria-label="Interactive portrait">
      <link rel="preload" as="image" href="/images/portrait-present.webp" />
      <link rel="preload" as="image" href="/images/portrait-academic-attire.svg" />
      <div className={"stage hero-composition hero-atmosphere"+(paused?" hero-motion-paused":"")} ref={stage}>
        <div className="hero-world" aria-hidden="true"><ContourField paused={paused}/></div>
        <h1 className="hero-name" aria-label="ZiyoMuhammad">
          <svg viewBox="0 0 1200 164" role="presentation" aria-hidden="true">
            <text x="10" y="124" textLength="1180" lengthAdjust="spacingAndGlyphs">ZiyoMuhammad</text>
          </svg>
        </h1>
        <div className="hero-portrait-plane">
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
            src="/images/portrait-academic-attire.svg"
            alt=""
            aria-hidden="true"
          />
        </div>
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
        <div className="hero-toolbar-actions">
        <button ref={pauseButton} type="button" className="hero-motion-toggle" hidden={!ready} aria-label={paused?"Resume ambient motion":"Pause ambient motion"} title={paused?"Resume ambient motion":"Pause ambient motion"}>{paused?<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 9 6-9 6Z" fill="currentColor"/></svg>:<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 4v12m6-12v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}</button>
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
      </div>
    </section>
  );
}
