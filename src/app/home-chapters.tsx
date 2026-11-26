import Link from "next/link";
import Portrait from "./portrait";
import Signature from "./signature";
import ProjectArt from "./project-art";
import { getFeaturedRecords } from "./featured-records";
import { projects } from "./projects/data";
import "./journal.css";

export default function HomeChapters() {
  const records = getFeaturedRecords();
  return (
    <>
      <div className="opening-spread">
        <div className="home-hero" id="film-present">
          <Portrait />
        </div>
        <section id="introduction" className="journal-intro">
          <div className="folio-rule">
            <span>Andijan, Uzbekistan</span>
            <span>My story</span>
          </div>
          <h2>
            A portrait
            <br />
            <i>in progress.</i>
          </h2>
          <div className="intro-note">
            <p>I’m a student with questions, projects and a long way to go.</p>
            <Link href="/about">Read my story ↗</Link>
          </div>
        </section>
      </div>
      <section id="film-memory" className="journal-memory">
        <div className="memory-lead">
          <span className="folio-label">The personal archive</span>
          <h2>
            Things
            <br />
            I’ve kept.
          </h2>
          <p>From the handball court to the Zakovat table.</p>
          <Link href="/achievements">Open the archive ↗</Link>
        </div>
        <div id="milestone-preview" className="memory-roll">
          {records.slice(0, 3).map((r) => (
            <figure key={r.id}>
              <Link href="/achievements">
                <img
                  src={r.document!.src}
                  alt={r.document!.alt}
                  loading="lazy"
                />
              </Link>
              <figcaption>
                {r.chapter} <span>{r.dateLabel}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section id="film-future" className="journal-work">
        <div className="folio-rule">
          <span>Selected initiatives</span>
          <Link href="/projects">All projects ↗</Link>
        </div>
        <h2>
          Ideas into <i>action.</i>
        </h2>
        <div id="projects">
          {projects.map((p) => (
            <Link
              id={"exhibit-" + p.slug}
              className={"work-row work-" + p.kind}
              href={"/projects/" + p.slug}
              key={p.slug}
            >
              <div className="work-image">
                <ProjectArt kind={p.kind} />
              </div>
              <div className="work-description">
                <span className="folio-label">{p.category}</span>
                <h3>{p.name}</h3>
                <p>{p.summary}</p>
              </div>
              <span className="work-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section id="interests" className="journal-margin">
        <span className="folio-label">Off the record</span>
        <h2>
          Beyond the
          <br />
          <i>classroom.</i>
        </h2>
        <p>Economics, psychology, politics, literature and the violin.</p>
        <Link href="/off-the-record">Open my notebook ↗</Link>
      </section>
      <section id="next-chapter" className="journal-end">
        <div className="folio-rule">
          <span>Andijan, Uzbekistan</span>
          <span>The next chapter</span>
        </div>
        <h2>
          Still <i>becoming.</i>
        </h2>
        <div className="closing-plate">
          <img
            src="/images/portrait-future.webp"
            alt="ZiyoMuhammad imagined in graduation attire"
          />
          <div>
            <Signature />
          </div>
        </div>
        <div className="closing-links">
          <p>Who I aspire to become.</p>
          <Link href="/contact">Let’s connect ↗</Link>
        </div>
        <footer>
          <nav aria-label="Explore">
            {[
              ["/about", "My story"],
              ["/projects", "Projects"],
              ["/achievements", "Milestones"],
              ["/off-the-record", "Off the record"],
            ].map(([url, name]) => (
              <Link href={url} key={url}>
                {name}
              </Link>
            ))}
          </nav>
          <nav aria-label="Social links">
            <a href="https://t.me/Shoxruxbekovich">Telegram</a>
            <a href="https://www.instagram.com/the_zzsh/">Instagram</a>
            <a href="https://github.com/iblamezzsh-tech/zm">GitHub</a>
          </nav>
          <a href="#top">Back to top ↑</a>
        </footer>
      </section>
    </>
  );
}
