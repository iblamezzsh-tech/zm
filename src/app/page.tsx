import SiteHeader from "./site-header";
import Portrait from "./portrait";

export default function Home() {
  return (
    <main>
      <SiteHeader />
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
