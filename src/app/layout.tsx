import type { Metadata } from "next";
import "@fontsource-variable/dm-sans/wght.css";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "./styles.css";
import "./design-refinement.css";
import Signature from "./signature";
import { RouteSignature } from "./signature-motion";
import SmoothScroll from "./smooth-scroll";
import SiteMotion from "./site-motion";
import "./journal.css";

import "./site-motion.css";
import "./motion-polish.css";
import "./art-direction.css";
import "./studio-v33.css";
import "./motion-choreography.css";
import "./editorial-motion.css";

// Runs before hydration, only for the initial motion-capable homepage.
 // No JS = no gate; failed JS = a bounded, readable fallback.
const bootScript=`(function(){try{
 if(location.pathname!=="/"||!matchMedia("(min-width:850px) and (min-height:460px) and (pointer:fine) and (prefers-reduced-motion:no-preference)").matches)return;
 var html=document.documentElement,done=false,hard=0;
 html.dataset.zmBoot="pending";
 function finish(){if(done)return;done=true;clearTimeout(hard);document.removeEventListener("zm-portrait-ready",finish);html.dataset.zmBoot="ready"}
 document.addEventListener("zm-portrait-ready",finish);
 hard=setTimeout(finish,4500);
 }catch(e){delete document.documentElement.dataset.zmBoot;}})();`;
const bootCSS=`
.zm-boot-screen{display:none}
html[data-zm-boot=pending] .zm-boot-screen,html[data-zm-boot=ready] .zm-boot-screen{display:flex;position:fixed;inset:0;z-index:9999;background:#24291e;color:#ffda24;align-items:center;justify-content:center;flex-direction:column;gap:22px;pointer-events:auto;visibility:visible;opacity:1}
html[data-zm-boot=pending] .zm-boot-screen{touch-action:none}
html[data-zm-boot=pending] .film-home{visibility:hidden}
html[data-zm-boot=pending] .film-home>.site-header,html[data-zm-boot=pending] .film-home .film-shot{visibility:hidden!important}
.zm-boot-mark{width:min(58vw,420px)}
.zm-boot-mark svg{width:100%;height:auto;display:block}
.zm-boot-screen>span{font:650 10px/1.2 Arial,sans-serif;letter-spacing:.18em}
html[data-zm-boot=pending] .zm-boot-mark{animation:zm-boot-breathe 1.5s ease-in-out infinite alternate}
html[data-zm-boot=ready] .zm-boot-screen{pointer-events:none;animation:zm-boot-reveal .45s cubic-bezier(.22,1,.36,1) both}
@keyframes zm-boot-breathe{from{opacity:.7;transform:translateY(3px)}to{opacity:1;transform:none}}
@keyframes zm-boot-reveal{from{opacity:1;visibility:visible}to{opacity:0;visibility:hidden}}
@media(prefers-reduced-motion:reduce){html[data-zm-boot] .zm-boot-screen{display:none!important}html[data-zm-boot=pending] .film-home,html[data-zm-boot=pending] .film-home>.site-header{visibility:visible}html[data-zm-boot=pending] .film-home .film-shot{visibility:visible!important}}
`;
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
        <div className="zm-boot-screen" aria-hidden="true"><div className="zm-boot-mark"><Signature/></div><span>ZM / THE JOURNEY CONTINUES</span></div>
        {children}
        <SmoothScroll />
        <SiteMotion />

        <RouteSignature />
      </body>
    </html>
  );
}
