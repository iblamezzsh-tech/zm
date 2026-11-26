import { type Project } from "./projects/data";

export default function ProjectArt({ kind }: { kind: Project["kind"] }) {
  if (kind === "think")
    return (
      <div
        className="quiz-broadside"
        aria-label="OverThink tournament concept poster"
      >
        <span>Zakovat / Andijan</span>
        <strong>
          Over
          <br />
          <i>Think.</i>
        </strong>
        <small>Intellectual quiz tournament</small>
      </div>
    );
  const finance = kind === "finance";
  return (
    <figure className={"studio-study study-" + kind}>
      <img
        src={"/images/" + (finance ? "ledger" : "specimen") + ".webp"}
        alt={
          finance
            ? "Concept study of folded ledger paper"
            : "Concept study of a plant and its roots"
        }
        loading="lazy"
      />
      <figcaption>
        {finance ? "Finance4Youth / Paper study" : "ReZamin / Root study"}
      </figcaption>
    </figure>
  );
}
