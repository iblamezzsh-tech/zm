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
          <div className="zm-boot-top"><strong>ZIYOMUHAMMAD</strong><span>INTRO / 01</span></div>
          <div className="zm-boot-center">
            <div className="zm-boot-editorial"><span>FROM THE PRESENT</span><strong>A portrait<br/><em>in progress.</em></strong></div>
            <div className="zm-boot-number" aria-hidden="true"><span/> <b>%</b></div>
            <svg className="zm-boot-ink" viewBox="100 28 478 160" aria-hidden="true">
              <g fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
                <path pathLength="1" d="M136 87 C142 77 221 50 258 48 C228 73 127 147 110 174 C151 144 216 119 250 117"/>
                <path pathLength="1" d="M264 119 l3 -2"/>
                <path pathLength="1" d="M277 130 Q293 98 333 47 Q318 98 321 107 C332 103 365 59 397 37 C378 67 354 110 365 120"/>
                <path pathLength="1" d="M127 182 C213 139 479 95 571 131"/>
              </g>
            </svg>
          </div>
          <div className="zm-boot-bottom">
            <div className="zm-boot-track" aria-hidden="true"><i/></div>
            <div className="zm-boot-meta"><span className="zm-boot-stage" aria-hidden="true"/><span>ANDIJAN / UZBEKISTAN</span></div>
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
