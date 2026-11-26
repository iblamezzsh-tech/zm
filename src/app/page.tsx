import Link from "next/link";
import Portrait from "./portrait";
import About from "./about";

export default function Home() {
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
      <Portrait />
    </main>
  );
}
