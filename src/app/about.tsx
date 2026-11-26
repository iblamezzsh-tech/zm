"use client";
import { useRef } from "react";
export default function About() {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button className="about" onClick={() => dialog.current?.showModal()}>
        About me <span className="about-arrow" aria-hidden="true" />
      </button>
      <dialog ref={dialog} aria-labelledby="about-title">
        <form method="dialog">
          <button className="about">Close ×</button>
        </form>
        <h2 id="about-title">About me</h2>
        <p>
          I’m ZiyoMuhammad, a student from Uzbekistan. I’m interested in
          economics, entrepreneurship, and education.
        </p>
        <p>The graduation portrait expresses my hopes for the future.</p>
      </dialog>
    </>
  );
}
