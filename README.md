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
| Hero background | Three.js `Points` + `LineSegments` driven by custom GLSL |
| Scroll | Lenis inertial scrolling synced to GSAP ScrollTrigger |
| Icons | Lucide React plus hand-rolled brand SVGs |
| Email | EmailJS (client side) |
| Headings | Clash Display (Fontshare) |
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
│   │   ├── ParticleField.jsx    Cursor-reactive 3D particle background
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

## The hero particle field

`src/components/ParticleField.jsx` renders the hero background. Every tunable
number lives in the `CONFIG` object at the top of the file.

**What it does**

- A jittered grid of ~3000 points (800 on mobile) fills a slab in front of the
  camera. A grid rather than pure noise keeps coverage even, with a random
  offset per point so it still reads as organic.
- Points drift on slow sine waves, and the whole cloud turns on Y at 0.0003
  radians per frame.
- The cursor repels nearby points. Anything within 3.0 world units is pushed
  outward along XY, hardest at the centre, easing to nothing at the rim.
- Roughly 500 of the closest point pairs are joined by faint white lines. Lines
  stretch as the cursor parts the field and fade out once overstretched.
- Exponential-squared fog and perspective size attenuation give depth; a CSS
  radial gradient feathers the whole thing into the page background.

**How it stays fast**

- All displacement happens in the vertex shader. Per frame the CPU only updates
  a handful of uniforms — no buffer uploads, no per-particle JavaScript.
- Points and lines share one GLSL displacement function, so a line always tracks
  its two endpoints exactly. Each line vertex carries the opposite endpoint as
  an attribute, which lets it measure the segment's true current length on the
  GPU.
- Link topology is built once at startup through a uniform spatial hash, so it
  costs O(n) rather than a full pairwise scan.
- Device pixel ratio is capped at 1.5. Under 768px wide the field drops to 800
  points with no lines and no cursor interaction.
- Rendering pauses when the hero scrolls offscreen or the tab is hidden, and
  frame deltas are clamped so a backgrounded tab never resumes with a jump.
- `prefers-reduced-motion: reduce` draws a single static frame and starts no
  animation loop at all.
- Everything is disposed on unmount, including a WebGL context release.

**Two things worth knowing if you edit it**

- Colours are converted with `linearToOutputTexel()` in the fragment shader.
  `THREE.Color` yields linear values and three.js only inserts that conversion
  into its own materials, so a custom `ShaderMaterial` that skips it renders
  roughly four times too dark.
- The repulsion falloff is written `1.0 - smoothstep(0.0, radius, dist)` rather
  than `smoothstep(radius, 0.0, dist)`. The reversed form is undefined behaviour
  in the GLSL ES spec even though it happens to work on most drivers.

---

## Typography

Headings use **Clash Display**. It is a Fontshare release, so it is not on
Google Fonts and there is no `@fontsource/clash-display` package — it loads from
the foundry CDN in `index.html`. Body copy uses **Inter**.

Every `h1` and `h2` picks up the display face from a base layer rule in
`src/index.css`, and components also carry an explicit `font-display` class so
the intent is visible in the markup.

Clash Display ships no true italic, so the hero headline uses a browser
synthesised oblique. Because a skewed glyph leans past its own advance width,
the gradient span carries a `.clip-safe` helper that widens the
`background-clip: text` paint box so the last letter is not shaved off.

---

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
