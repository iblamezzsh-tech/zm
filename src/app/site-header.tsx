import Link from "next/link";

export default function SiteHeader({ about = false }: { about?: boolean }) {
  return (
    <header>
      <Link className="identity" href="/" aria-label="ZiyoMuhammad home">
        <img src="/icon.svg" alt="" width="39" height="39" />
        <span>Personal website</span>
      </Link>
      <Link className="about" href={about ? "/" : "/about"}>
        {about ? "Portrait" : "About me"}{" "}
        <span className="about-arrow" aria-hidden="true" />
      </Link>
    </header>
  );
}
