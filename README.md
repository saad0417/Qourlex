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
| Headings | Epic Pro, with Clash Display as the fallback |
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
│   │   └── fonts/               Epic Pro (see the licence note below)
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

## The hero sphere cluster

`src/components/HeroSpheres.jsx` renders the hero background with React Three
Fiber. Every tunable number lives in the `CONFIG` object at the top of the file.

**What it does**

- 155 glossy spheres sit on a Fibonacci-distributed shell, which gives even
  coverage with no polar clumping. A little radial jitter keeps it organic.
- A glowing core sits inside the shell, visible wherever the cluster opens.
- The cluster turns slowly on Y and every ball bobs on its own sine wave.
- The cursor repels nearby balls. Each one eases toward a target position each
  frame rather than jumping, so the cluster parts like something with weight and
  drifts home once the cursor leaves.
- On desktop the cluster sits right of centre and the headline takes the left.
  Below 1024px it centres behind the copy, dropped in opacity and covered by a
  scrim so the headline stays the focal point.

**How it stays fast**

- All 155 spheres are one `InstancedMesh`, so the cluster is a single draw call.
  Per-ball colour rides on the instance colour buffer.
- The frame loop writes matrices into that buffer and nothing else. No React
  state is touched, and pointer moves never trigger a render.
- Device pixel ratio is capped at `[1, 1.5]`. Under 768px the cluster drops to
  28 spheres at lower tessellation, skips the reflection probe, and turns the
  cursor interaction off entirely.
- Reflections come from an `Environment` built out of `Lightformer` rectangles
  rather than one of drei's HDR presets. The presets stream several megabytes
  from a third-party CDN on every visit, which is a bad trade for a background.
- `prefers-reduced-motion: reduce` holds the cluster still.
- React Three Fiber disposes the scene when the canvas unmounts.

**Measured** on an Intel UHD Graphics (CML GT2) at 1440x900: 60fps with a median
frame of 16.7ms, both idle and with the cursor sweeping the cluster. Mobile
viewport on the same GPU: 57fps.

## Typography

Headings use **Epic Pro**, loaded from `src/assets/fonts/`. Body copy uses
**Inter**.

Two things to know about the supplied font file:

- **It is the demo cut, licensed for personal use only.** The foundry's read-me
  is kept alongside it at `src/assets/fonts/EpicPro-LICENSE.txt`. A commercial
  licence has to be bought from Glyphonic before this site goes live.
- **The demo cut has no apostrophe.** It ships A-Z, a-z, 0-9 and `. , ? ! &`
  only. Three section headings contain an apostrophe, so **Clash Display** sits
  next in the stack and supplies exactly those glyphs. It is the closest match
  to Epic Pro's proportions, so the substitution is not obvious.

Epic Pro also draws its lowercase letters as capitals, so headings render in all
caps regardless of how they are typed in the JSX.

Every `h1` and `h2` picks up the display face from a base layer rule in
`src/index.css`, and components also carry an explicit `font-display` class so
the intent is visible in the markup.

Neither face ships a true italic, so the hero headline uses a browser
synthesised oblique. Because a skewed glyph leans past its own advance width,
the gradient span carries a `.clip-safe` helper that widens the
`background-clip: text` paint box so the last letter is not shaved off.

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
