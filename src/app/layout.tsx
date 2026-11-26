import type { Metadata } from "next";
import "@fontsource-variable/dm-sans/wght.css";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "./styles.css";
import "./design-refinement.css";
import { RouteSignature } from "./signature-motion";
import SmoothScroll from "./smooth-scroll";
import "./motion-polish.css";

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
        <RouteSignature />
      </body>
    </html>
  );
}
