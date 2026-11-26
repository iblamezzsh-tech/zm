import SiteHeader from "../site-header";
import Signature from "../signature";

export const metadata = { title: "About me — ZiyoMuhammad" };

export default function About() {
  return (
    <main>
      <SiteHeader about />
      <article className="bio">
        <h1>
          About <span>me.</span>
        </h1>
        <p>
          I’m ZiyoMuhammad, a student from Uzbekistan. I’m interested in
          economics, entrepreneurship, and education.
        </p>
        <p>The graduation portrait expresses my hopes for the future.</p>
        <Signature />
      </article>
    </main>
  );
}
