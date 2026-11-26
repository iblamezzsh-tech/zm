# ZiyoMuhammad — Signature Portrait

A personal homepage built with Next.js, TypeScript, and a GSAP-driven radial CSS mask.

Use Node.js 22 or later. Run `npm ci` and `npm run dev` for local development. Run `npm run lint`, `npm run typecheck`, and `npm run build` for production checks. Use `npm start` to serve the production build.

## Portrait assets

Place the registered photographs at `public/images/portrait-present.webp` and `public/images/portrait-future.webp` before building. Both files need identical canvas dimensions and matching facial landmarks. The second photograph represents a future academic aspiration.

The homepage renders the available present image in HTML. When both images decode in the browser, pointer movement or a touch reveals the future layer locally. The Present/Future control toggles the full layer and supports keyboard input. With reduced motion enabled, the mask tracks directly. When source photos are absent, the page displays a typographic monogram.
