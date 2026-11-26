import type { Metadata } from "next";
import "@fontsource-variable/dm-sans/wght.css";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "./styles.css";
import { RouteSignature } from "./signature-motion";

export const metadata: Metadata = {
  title: "ZiyoMuhammad — Portrait",
  description:
    "A personal portrait of ZiyoMuhammad, a student from Uzbekistan, and his academic aspirations.",
};
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <RouteSignature />
      </body>
    </html>
  );
}
