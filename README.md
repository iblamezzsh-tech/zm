# ZiyoMuhammad — Signature Portrait

A personal homepage built with Next.js, TypeScript, and a GSAP-driven radial CSS mask.

Use Node.js 22 or later. Run `npm ci` and `npm run dev` for local development. Run `npm run lint`, `npm run typecheck`, and `npm run build` for production checks. Use `npm start` to serve the production build.

## Portrait assets

The two 1070 × 850 WebPs in `public/images` share a canvas, a contour background supplied by CSS, and the original white-shirt facial detail. The academic attire represents a future aspiration. Both images are preloaded. The present image is rendered in HTML and works without JavaScript.

Move the pointer or touch and drag to reveal the future portrait locally. Use the Present/Future button to toggle the whole image, including with Enter or Space. Reduced motion makes the response immediate.
