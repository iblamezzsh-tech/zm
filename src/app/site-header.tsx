import Link from "next/link";

export default function SiteHeader({ about = false }: { about?: boolean }) {
  return (
    <header className="site-header">
      <Link className="identity" href="/" aria-label="ZiyoMuhammad home">
        <img src="/icon.svg" alt="" width="45" height="45" />
        <span className="identity-wordmark">ZiyoMuhammad</span>
      </Link>
      <nav className="primary-nav" aria-label="Primary navigation">
        <Link href="/" aria-current={!about ? "page" : undefined}>Home</Link>
        <Link href="/about" aria-current={about ? "page" : undefined}>About</Link>
        <Link href="/#projects">Projects</Link>
        <Link href="/#interests">Interests</Link>
      </nav>
      <Link className="about header-action" href={about ? "/" : "/about"}>
        {about ? "Back to portrait" : "Get to know me"} <span className="about-arrow" aria-hidden="true" />
      </Link>
    </header>
  );
}
