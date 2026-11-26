import Link from "next/link";
import { existsSync } from "node:fs";
import { join } from "node:path";
import Portrait from "./portrait";
import About from "./about";

export default function Home() {
  const present = existsSync(
    join(process.cwd(), "public/images/portrait-present.webp"),
  );
  const future = existsSync(
    join(process.cwd(), "public/images/portrait-future.webp"),
  );
  return (
    <main>
      <header>
        <Link className="identity" href="/" aria-label="ZiyoMuhammad home">
          <img src="/icon.svg" alt="" width="39" height="39" />
          <span>Personal website</span>
        </Link>
        <About />
      </header>
      <div className="mast">
        <div className="eyebrow">
          <i /> Student &amp; founder
        </div>
        <h1>
          Ziyo<span>Muhammad</span>
        </h1>
        <div className="location">Based in Uzbekistan</div>
      </div>
      <Portrait present={present} future={future} />
    </main>
  );
}
