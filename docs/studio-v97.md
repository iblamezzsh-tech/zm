# V97 — Mobile Hero Art Direction (unpublished draft)
Original base WebP header and academic SVG viewBox confirmed 1070×850. Visually inspected the base portrait; source landmarks estimated at crown y=104, head width ~400 px; academic cap apex y=20 from SVG path. Geometry constrains face width, title clearance, and targets ~74.5% visible portrait height where aspect ratio allows. Tall narrow screens may need a smaller subject to preserve width and cap clearance. No photo distortion or replacement.
- Mobile only: remove Scroll to discover control, keep desktop link and native scrolling.
- Shared portrait fit/scale for base, overlay and fluid canvas; raise mobile compositing resolution to max 2.5 device pixels per logical pixel.
- Tap-to-look drives a 1.18s organic reversible canvas mask; idle and pointer effects preserved, reduced-motion fallback remains instant.
- Header-safe title position, restrained contour contrast, compact 44px look control, subtle bottom vignette.
- Geometry math and mask coverage checks passed for representative viewport dimensions. No browser rendering or build run. No deployment requested: commit object created without moving a Git ref. Continue subsequent work from this commit or explicitly attach it to the refinement branch when deployment is authorized.
