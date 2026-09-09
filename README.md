# Qourlex AI — Website

> **"Every Ring Answered. Every Lead Captured. Every Job Booked."**

Marketing site for **Qourlex AI**, an agency building 24/7 autonomous AI voice
receptionists for home service businesses (plumbers, HVAC companies,
electricians, roofers) across the United States.

This is a **frontend-only static site**. There is no backend: the contact form
delivers through EmailJS from the browser, and the build output is a folder of
static files that deploys straight to Vercel.

---

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS 3 with the Qourlex design tokens |
| Hero background | React Three Fiber + drei, instanced glossy sphere cluster |
| Scroll | Lenis inertial scrolling synced to GSAP ScrollTrigger |
| Icons | Lucide React plus hand-rolled brand SVGs |
| Email | EmailJS (client side) |
| Headings | Epic Pro (8 weights, self-hosted), Clash Display fallback |
| Body text | Inter (Google Fonts) |

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the production build on :4173
npm run lint     # oxlint
```

Requires Node 20 or newer.

---

## Project structure

```
qourlex-website/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           Glassmorphism header and mobile overlay
│   │   ├── Hero.jsx             Headline, CTAs, trust strip
│   │   ├── HeroSpheres.jsx      Cursor-reactive 3D sphere cluster
│   │   ├── Problem.jsx          Missed-call pain point and stats
│   │   ├── AnimatedCounter.jsx  GSAP ScrollTrigger count-up
│   │   ├── HowItWorks.jsx       Three-step workflow
│   │   ├── Services.jsx         Six service modules
│   │   ├── Industries.jsx       3D flip cards per trade
│   │   ├── Comparison.jsx       Human vs Qourlex AI
│   │   ├── Testimonials.jsx     Founding Client Program
│   │   ├── Pricing.jsx          Single transparent plan
│   │   ├── FAQ.jsx              Accessible accordion
│   │   ├── Contact.jsx          Contact form and demo booking
│   │   ├── Footer.jsx           Multi-column footer
│   │   ├── Logo.jsx             Brand mark
│   │   └── SocialIcons.jsx      Social vectors
│   ├── hooks/
│   │   └── useGsapAnimation.js  GSAP scope hook with cleanup
│   ├── utils/
│   │   └── emailjs.js           Contact form delivery
│   ├── assets/
│   │   └── fonts/               Epic Pro, 8 weights (see the licence note)
│   ├── App.jsx                  Root layout and Lenis coordinator
│   ├── index.css                Tailwind layers, glass system, hero field CSS
│   └── main.jsx
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── vercel.json
└── package.json
```

---

## Brand mark

`src/components/Logo.jsx` carries the Qourlex Q as vector geometry: the heavy
ring, its diagonal tail, and the five-bar voice waveform in the counter. It was
traced from the supplied artwork (`logo3.png`) by measuring the source at
1254px and normalising to a 128 unit box, so the proportions match the original
exactly.

It is vector rather than the supplied PNG on purpose. The artwork ships on a
solid background with no alpha channel, and at roughly 800KB each those files
would have been the heaviest assets on the page. The SVG is under 1KB, stays
crisp at any size, and takes its colour from CSS, so the same component serves
the header, the footer, and the emblem on the 3D core.

The wordmark beside it carries a `.brand-wordmark` class that nudges it down
0.075em. Epic Pro sets its capitals high in the em box, so a plain
`items-center` centres the text's *box* while leaving the visible letters 1.5px
high at 20px. The nudge centres the letters on the mark instead.

The mark carries a filled counter behind the waveform. Without it the page
shows through the ring and the bars lose their ground; with it the logo reads
the same on any background.

`public/favicon.svg` is a **separate drawing, not the same mark scaled down**.
It is just the Q letterform on a solid indigo tile, with no waveform at all: at
16px the five bars fall well under a pixel wide and read as noise inside an
already small ring. One bold shape at high contrast is what survives the size.
Checked at 16, 24, 32, 48, 64 and 128px, and in both light and dark tab bars.

## The hero sphere cluster

`src/components/HeroSpheres.jsx` renders the hero background with React Three
Fiber. Every tunable number lives in the `CONFIG` object at the top of the file.

**What it does**

- 155 glossy spheres sit on a Fibonacci-distributed shell, which gives even
  coverage with no polar clumping.
- A lit core sits inside, carrying the Qourlex mark. It is drawn to a canvas
  from the same geometry as `Logo.jsx` and billboarded, so it always faces the
  viewer while the shell turns around it.
- The mark is centred on its **ink centroid, not its bounding box**. The Q's
  tail carries real mass low and right, so a box-centred mark measures as
  symmetric while reading as sitting low inside a circle. Measured off the
  rendered artwork, the centroid sits 3.2 units below the box centre in the
  128-unit box; `LOGO_INK_CENTROID` holds the correction.
- The emblem is aimed at the camera with `lookAt`, **not** drei's `<Billboard>`.
  Billboard copies the camera's rotation, which is screen-aligned rather than
  aimed at a point. The emblem is offset forward off the core's surface, and
  under Billboard that offset runs along world +Z instead of along the view
  ray. Because the cluster sits off-axis to the right, a forward offset that is
  not on the view ray moves the mark sideways on screen: measured at 1440x900
  it landed 19px right of the orb centre, a third of the orb's radius, with
  40px of margin on one side and 5px on the other. `lookAt` puts the offset on
  the view ray, where moving along it changes nothing on screen. After the fix
  the ink centroid sits within 1% of the orb centre with even margins.
- The cursor parts the shell. The repulsion field is a **cylinder along the view
  axis**, not a sphere around a point: measuring in 3D pushed the balls sitting
  directly in front of the core straight at the camera, so they kept covering
  it. Measuring and pushing in XY opens a clean tunnel through to the emblem.
- That field is applied in **world space, not the group's local space**. The
  shell turns, and a quarter turn puts local X along the view axis, so a
  local-space push stopped parting the shell and started pushing balls toward
  the camera instead. Ball positions are lifted through `matrixWorld` for the
  test, pushed there, and mapped back. Verified by spinning the cluster at
  1.2 rad/s and sampling the opening across a full revolution: the worst angle
  still exposes 2.26x the core that idle does.
- Every ball eases toward its target each frame rather than jumping, so the
  cluster parts like something with weight and drifts home when the cursor
  leaves.
- The cluster sits right of centre with the headline on the left. It is a
  desktop-only element; see **The mobile hero** below.

**The balls never merge, and it is solved rather than avoided**

The balls are sized to pack tightly, close to touching. They are kept from
interpenetrating by a contact solver, not by being made small enough that they
cannot reach each other.

Each frame, after every ball has eased toward its target, overlapping pairs are
pushed apart along the line of centres, each taking half the correction. That is
the positional-correction step of a position-based dynamics solver, run for two
passes. The rest layout is relaxed the same way at build time, with each ball
re-seated on its own shell radius after every pass so the cluster keeps its
spherical form instead of inflating.

The pair list is built once from the rest positions, since the shell topology
does not change. Pairs that could never touch are excluded, which brings the
cost to roughly a thousand distance checks a frame.

The payoff is behaviour rather than geometry: balls shoved by the cursor shove
their neighbours in turn, so the shell parts like something physical instead of
like a set of independent points. The correction is deliberately under-relaxed
(`stiffness` below 1) to stop neighbours trading pushes and buzzing.

**How it stays fast**

- All 155 spheres are one `InstancedMesh`, so the cluster is a single draw call.
  Per-ball colour rides on the instance colour buffer.
- The frame loop writes matrices into that buffer and nothing else. No React
  state is touched, and pointer moves never trigger a render.
- Device pixel ratio is capped at `[1, 1.5]`. Below 1024px the canvas is not
  mounted at all, so there is no WebGL work on phones or tablets.
- Reflections come from an `Environment` built out of `Lightformer` rectangles
  rather than one of drei's HDR presets, which stream several megabytes from a
  third-party CDN on every visit.
- `prefers-reduced-motion: reduce` holds the cluster still.

**Measured** on an Intel UHD Graphics (CML GT2) at 1440x900: 60fps with a median
frame of 16.7ms, idle and with the cursor sweeping the cluster, and not one
frame over 20ms across 239 samples.

## The mobile hero

Below 1024px the copy sits on a frosted panel (`.hero-glass`) and **the WebGL
canvas is not rendered at all**. The sphere cluster used to sit behind the
panel, but a lit cluster under a heavy blur pushes so much colour through that
the panel reads as a solid blue block rather than glass. The panel now diffuses
a plain gradient wash instead, which is calmer and closer to the intent.

Not rendering it is also the honest performance answer: phones and tablets never
create a WebGL context, compile a shader, or run a frame loop for the hero.

Browsers without `backdrop-filter` get a solid panel through an `@supports`
fallback.

The colour wash behind the panel is deliberately restrained. Everything the
panel diffuses comes from `.hero-spheres__glow`, so raising those gradient
alphas is what turns the hero blue; they sit low on purpose.

The eyebrow pill and the mobile menu control both carry their own contrast
rather than relying on the glass. On a frosted panel an accent-coloured label at
10% opacity and a near-transparent nav control are legible in a mockup and
invisible on a phone in daylight. The pill uses light text on a stronger indigo
ground, and the menu button is a solid 44x44 target, which is also the minimum
comfortable tap size.

## Typography

Headings use **Epic Pro** (GC Epic Pro Demo, Glyphonic), all eight weights from
Thin to ExtraBold, self-hosted from `src/assets/fonts/`. Body copy uses
**Inter**.

Three things to know:

- **It is the demo release, licensed for personal use only.** The foundry's read
  me is kept at `src/assets/fonts/EpicPro-LICENSE.txt`. This site is commercial,
  so a licence has to be bought from Glyphonic before launch.
- **The demo weights contain letters and nothing else** — 55 glyphs, A-Z and
  a-z. No digits, no punctuation. Two fallbacks close that gap:
  1. An earlier single-weight cut of the same typeface does carry `0-9` and
     `. , ? ! &`. It is declared under the same family with a `unicode-range`
     limited to exactly those characters, so digits and full stops still render
     in Epic Pro. **It is declared once per fixed weight rather than as one
     `font-weight: 100 900` face.** Verified in Chrome: a weight *range* on a
     `unicode-range` face is never selected, and the characters fall through to
     the next family instead. All eight rules point at the same file, so it is
     still a single download.
  2. **Clash Display** sits next in the stack for what is left, which in
     practice is the apostrophe in three section headings.
- **Epic Pro draws its lowercase as capitals**, so headings render in all caps
  regardless of how they are typed in the JSX.

Every letter face also carries an explicit `unicode-range`. Without one they
claim the whole of Unicode, and the browser is left to fall through them by
declaration order to find a missing glyph.

Every `h1` and `h2` picks up the display face from a base layer rule in
`src/index.css`, and components also carry an explicit `font-display` class so
the intent is visible in the markup.

Neither Epic Pro nor Clash Display ships a true italic, so the hero headline
uses a browser synthesised oblique. Because a skewed glyph leans past its own
advance width, the gradient span carries a `.clip-safe` helper that widens the
`background-clip: text` paint box so the last letter is not shaved off.

## The --frost custom property

Every frosted surface routes its blur through a `--frost` custom property:

```css
--frost: blur(20px) saturate(180%);
-webkit-backdrop-filter: var(--frost);
backdrop-filter: var(--frost);
```

This is not stylistic. Written literally, the CSS minifier compares the two
declarations, decides the standard property is redundant next to the prefixed
one, and emits **only** `-webkit-backdrop-filter`. Chrome does not honour that
alias, so every glass surface on the site silently rendered with no blur at all
while still looking correct in the source. Setting `build.cssTarget` did not
change it. Routing the value through a `var()` does, because the minifier can no
longer prove the two declarations are equivalent.

If you edit these, verify against the built CSS rather than the source:

```bash
npm run build
grep -c '[;{]backdrop-filter:' dist/assets/*.css   # must be > 1
```

## Reveal animations and mobile overflow

`revealOffset()` in `src/hooks/useGsapAnimation.js` picks which direction a
scroll reveal starts from.

Sliding a column in from the side only makes sense once the columns actually sit
side by side. Once they stack, the element is full width, so a positive `x`
offset parks it past the right edge of the viewport until its ScrollTrigger
fires. `body` has `overflow-x: hidden`, so the page cannot be scrolled sideways
to reach it — the content is simply clipped, which is what made the mobile menu
and CTAs look cut off. Below the breakpoint the reveal now comes from below.

Each section passes the width at which its own layout goes side by side:
Industries at 640, Comparison at 768, Contact at 1024.

## Scrolling

Lenis is configured in `src/App.jsx`. The settings were measured on this page,
not chosen by feel.

`lerp` mode was tried first on the assumption that a continuous follow would be
smoother than per-event durations. It is worse here. Driving a trackpad-like
wheel stream through the whole page on an Intel UHD:

| | per-frame scroll step variance | p95 frame | frames over 20ms |
| --- | --- | --- | --- |
| `lerp: 0.085` | 11.3px | 33.3ms | 20 / 295 |
| `duration: 1.2` | 5.3px | 16.8ms | 13 / 335 |
| `duration: 1.9` | 4.7px | 16.8ms | 11 / 338 |

Duration mode wins clearly. The variance metric keeps falling as the duration
grows, so it cannot be maximised blindly — a longer glide is smoother by that
measure and more sluggish to use. `1.5` is the settled value: a longer glide
than the previous `1.2`, still responsive, and no added long frames.

The bigger structural win is that **the hero cluster stops rendering once it
scrolls out of view**. It previously ran at 60fps for the entire length of the
site, competing for frame time with the scroll and every ScrollTrigger reveal.
An IntersectionObserver now switches the R3F frameloop to `never` off-screen and
back to `always` on return. Reduced motion uses `demand` rather than `never`, so
the scene still draws once instead of coming up blank.

## Contact form

`src/utils/emailjs.js` sends submissions through EmailJS. Override the defaults
with a `.env` file, or with project environment variables in Vercel:

```
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```

EmailJS public keys are designed to be exposed in the browser, so committing the
production defaults is intentional.

---

## Deployment

Push to a Git branch connected to Vercel. `vercel.json` pins the Vite preset,
`npm run build`, and `dist/` as the output directory, and adds an immutable
cache header for hashed assets.

There is deliberately no SPA rewrite. Every link on the site is a hash anchor
and there is no client-side router, so rewriting unknown paths to `index.html`
would turn every mistyped URL into a soft 404. If a router is ever added, add
`"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]` at that
point — Vercel checks the filesystem before rewrites, so static assets stay
safe.

Nothing else is required. There is no server to run and no runtime environment
beyond the three optional EmailJS variables above.
