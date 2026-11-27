# V96 — ZM Mobile Masterpiece / foundation

Scope: mobile <=899px only; existing hero V94 and finale V95 compositions remain. No desktop redesign, no new visual assets, no production promotion.

- Tokens: 4/8/12/16/24/32/48/64px rhythm, fluid gutters, 44px minimum core control target, 64px base navigation safe band, 15–19px reading text, 10–12px metadata, 36–76px fluid display.
- Palette: preserve ZM ink/olive/paper/yellow; reserve lime for finale. Contrast calculations for base text pairs: 24291e/f4f1e8 13.18:1; 515d45/f4f1e8 6.19:1; 24291e/ffda24 10.85:1; cbd3bc/24291e 9.63:1; 24291e/d5ff00 12.85:1. This is token contrast, not whole-page accessibility certification.
- Unify primary navigation across homepage and studio54 routes; home fixed, interior sticky. Reuse token-based header safe offsets and existing route/menu animations.
- Preserve native touch scroll, keyboard focus and reduced-motion behavior. Do not use blanket overflow hidden to conceal layout errors.
- Mobile route gutters and prose sizes share aliases; project artwork, hero photo, wordmarks, and finale composition remain separate.
- Source checks: balanced CSS blocks; header grid arithmetic at 320/360/390/430/768px; contrast calculations. Browser/device screenshots and interaction QA pending.
- Next V97: inspect actual portrait image bounds and match base/future/canvas crop with reference; no production release until final QA.
