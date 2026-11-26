import Link from "next/link";

export default function SiteHeader({ about = false, projects = false, achievements = false, personal = false }: { about?: boolean; projects?: boolean; achievements?: boolean; personal?: boolean }) {
  return (
    <header className="site-header">
      <Link className="identity" href="/" aria-label="ZiyoMuhammad home">
        <img src="/icon.svg" alt="" width="45" height="45" />
        <span className="identity-wordmark">ZiyoMuhammad</span>
      </Link>
      <nav className="primary-nav" aria-label="Primary navigation">
        <Link href="/" aria-current={!about && !projects && !achievements && !personal ? "page" : undefined}>Home</Link>
        <Link href="/about" aria-current={about ? "page" : undefined}>My story</Link>
        <Link href="/projects" aria-current={projects ? "page" : undefined}>Projects</Link>
        <Link href="/achievements" aria-current={achievements ? "page" : undefined}>Milestones</Link>
        <Link href="/off-the-record" aria-current={personal ? "page" : undefined}>Off the record</Link>
      </nav>
      <Link className="about header-action" href={about ? "/" : "/about"}>
        {about ? "Back to portrait" : "Get to know me"} <span className="about-arrow" aria-hidden="true" />
      </Link>
    </header>
  );
}
