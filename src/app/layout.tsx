import type { Metadata } from "next";
import "@fontsource-variable/dm-sans/wght.css";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "./styles.css";
import "./design-refinement.css";
import { RouteSignature } from "./signature-motion";
import SmoothScroll from "./smooth-scroll";
import SiteMotion from "./site-motion";
import "./site-motion.css";
import "./motion-polish.css";
import "./art-direction.css";
import "./studio-v33.css";

export const metadata: Metadata = {
  title: "ZiyoMuhammad — Personal Portfolio",
  description:
    "Meet ZiyoMuhammad, a student and founder from Uzbekistan. Explore his projects, interests and academic aspirations.",
};
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <SmoothScroll />
        <SiteMotion />
        <RouteSignature />
      </body>
    </html>
  );
}
