import React from 'react';
import { PhoneCall, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { HeroSpheres } from './HeroSpheres';

const TRUST_POINTS = [
  'Zero missed calls',
  'Real human voice tone',
  '48-hour live onboarding',
];

const CLIENTS = [
  'Apex Plumbing Co.',
  'ProAir Heating & Cooling',
  'VoltCraft Electric',
  'Summit Ridge Roofing',
  'TrueComfort HVAC',
];

export const Hero = () => {
  const handleScrollToHowItWorks = (event) => {
    event.preventDefault();
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden bg-primary-bg pt-28 pb-16 sm:pt-32 sm:pb-20"
      aria-label="Qourlex AI Voice Agents Introduction"
    >
      {/* Cursor-reactive 3D sphere cluster. Renders behind everything and never
          intercepts pointer events, so all links and buttons stay clickable. */}
      <HeroSpheres />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Copy column. Centred until the split layout kicks in at lg, and
              below that it sits on a frosted panel: the sphere cluster diffuses
              through the blur instead of muddying the text behind it. */}
          <div className="hero-glass flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="hero-eyebrow inline-flex max-w-full items-center gap-2 rounded-full border border-accent-primary/45 bg-accent-primary/25 px-3.5 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[1.6px] sm:tracking-[2.5px] text-[#DDE3FF] mb-6 sm:mb-7">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              {/* Full wording needs more room than a small phone has, so the
                  short form is used there rather than letting the pill wrap. */}
              <span className="whitespace-nowrap sm:hidden">AI Voice Agents</span>
              <span className="hidden whitespace-nowrap sm:inline">
                AI Voice Agents for Home Services
              </span>
            </div>

            {/* Headline — Epic Pro, italic */}
            <h1 className="font-display italic font-bold text-white text-[36px] leading-[1.06] xs:text-[40px] sm:text-[54px] sm:leading-[1.05] lg:text-[60px] xl:text-[68px] xl:leading-[1.04] tracking-[-0.012em] mb-6">
              Never Miss a{' '}
              <span className="clip-safe bg-clip-text text-transparent bg-gradient-to-br from-white via-[#C7D2FE] to-[#818CF8]">
                Customer Call
              </span>{' '}
              Again
            </h1>

            <p className="max-w-xl text-[15px] sm:text-lg text-text-muted leading-relaxed mb-8 sm:mb-9">
              AI voice receptionists that answer every ring, qualify leads, schedule jobs
              directly into your CRM, and dispatch emergencies — 24/7 across the United States.
            </p>

            {/* CTAs — full width and stacked on mobile, inline from sm up */}
            <div className="flex w-full flex-col sm:flex-row sm:w-auto items-stretch sm:items-center gap-3 sm:gap-3.5 mb-8 sm:mb-10">
              <a
                href="https://calendly.com/saadakhtar2222/ai-receptionist-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-white/15 bg-accent-primary px-7 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:bg-accent-primary-hover sm:hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <PhoneCall className="w-5 h-5 shrink-0" />
                <span>Book a Free Demo</span>
              </a>

              <button
                type="button"
                onClick={handleScrollToHowItWorks}
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl apple-glass-pill px-7 py-4 text-base font-medium text-text-body transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                <span>See How It Works</span>
                <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Trust checklist — wraps cleanly, never overflows */}
            <ul className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2.5 text-[13px] sm:text-sm text-text-muted">
              {TRUST_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-status-success" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column is intentionally empty on desktop: the sphere cluster
              renders into it from the 3D scene behind. It only reserves height
              so the copy column does not stretch across the full width. */}
          <div className="hidden lg:block lg:h-[520px]" aria-hidden="true" />
        </div>
      </div>

      {/* Client strip. Scrolls horizontally on small screens instead of wrapping
          into a tall stack that pushes the fold down. */}
      <div className="relative z-10 mt-14 sm:mt-16 w-full">
        <p className="px-5 text-center text-[10px] sm:text-[11px] font-medium uppercase tracking-[2px] text-[#64748B] mb-4">
          Trusted by home service businesses across the US
        </p>
        <div className="client-strip flex items-center gap-2.5 sm:gap-4 overflow-x-auto px-5 pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-6">
          {CLIENTS.map((company) => (
            <div
              key={company}
              className="apple-glass-pill flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-text-muted opacity-70"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary" />
              <span className="whitespace-nowrap">{company}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
