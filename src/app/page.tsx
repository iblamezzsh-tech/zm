import SiteHeader from "./site-header";
import Portrait from "./portrait";
import HomeChapters from "./home-chapters";

export default function Home() {
  return (
    <main className="home-page" id="top">
      <a className="skip-link" href="#introduction">Skip to introduction</a>
      <SiteHeader />
      <div className="home-hero">
        <Portrait />
      </div>
      <HomeChapters />
      <footer className="home-footer"><span>ZiyoMuhammad</span><span>Personal portfolio / Uzbekistan</span><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}
