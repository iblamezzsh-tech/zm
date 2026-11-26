import type { Metadata } from "next";
import "@fontsource-variable/dm-sans/wght.css";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "./styles.css";
import "./design-refinement.css";
import { RouteSignature } from "./signature-motion";
import SmoothScroll from "./smooth-scroll";
import SiteMotion from "./site-motion";
import FlowMotion from "./flow-motion";
import "./flow-motion.css";
import "./site-motion.css";
import "./motion-polish.css";
import "./art-direction.css";
import "./studio-v33.css";
import "./motion-choreography.css";
import "./editorial-motion.css";
import "./surface-colors.css";
import "./studio55.css";
import "./studio57.css";
import "./studio59.css";
import "./studio61.css";
import "./button-motion.css";

import {bootCSS,bootScript} from "./boot-intro";

export const metadata: Metadata = {
  title: "ZiyoMuhammad — Personal Portfolio",
  description:
    "Meet ZiyoMuhammad, a student and founder from Uzbekistan. Explore his projects, interests and academic aspirations.",
};
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{__html:bootCSS}}/>
        <script dangerouslySetInnerHTML={{__html:bootScript}}/>
      </head>
      <body>
        <div className="zm-boot-screen" data-lenis-prevent>
          <div className="zm-boot-atlas" aria-hidden="true"/>
          <div className="zm-boot-light" aria-hidden="true"/>
          <div className="zm-boot-top"><strong>ZM<span>.</span></strong><span>ANDIJAN / UZBEKISTAN</span><span>FRAME 001 — THE PRESENT</span></div>
          <div className="zm-boot-stagecraft" aria-hidden="true">
            <div className="zm-boot-wordmark"><svg viewBox="0 0 1200 164"><text x="10" y="124" textLength="1180" lengthAdjust="spacingAndGlyphs">ZiyoMuhammad</text></svg></div>
            <div className="zm-boot-portrait"><img src="/images/portrait-present.webp" alt="" fetchPriority="high"/></div>
            <div className="zm-boot-title"><small>THE ART OF BECOMING</small><strong>Every story<br/><em>starts somewhere.</em></strong></div>
            <div className="zm-boot-number"><span/><b>%</b><small>REVEALING THE FIRST FRAME</small></div>
            <svg className="zm-boot-ink" viewBox="100 28 478 160">
              <g fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                <path pathLength="1" d="M136 87 C142 77 221 50 258 48 C228 73 127 147 110 174 C151 144 216 119 250 117"/>
                <path pathLength="1" d="M264 119 l3 -2"/>
                <path pathLength="1" d="M277 130 Q293 98 333 47 Q318 98 321 107 C332 103 365 59 397 37 C378 67 354 110 365 120"/>
                <path pathLength="1" d="M127 182 C213 139 479 95 571 131"/>
              </g>
            </svg>
          </div>
          <div className="zm-boot-bottom">
            <div className="zm-boot-track" aria-hidden="true">{Array.from({length:20},(_,i)=><i key={i} style={{"--boot-i":i} as React.CSSProperties}/>)}</div>
            <div className="zm-boot-meta"><span className="zm-boot-stage" aria-hidden="true"/><span>THE JOURNEY CONTINUES ↗</span></div>
            <div className="zm-boot-access" role="status">Preparing the portfolio.</div>
            <button type="button" data-boot-skip className="zm-boot-skip">Continue with available assets <span aria-hidden="true">↗</span></button>
          </div>
        </div>
        {children}
        <SmoothScroll />
        <SiteMotion />
        <FlowMotion />
        <RouteSignature />
      </body>
    </html>
  );
}
