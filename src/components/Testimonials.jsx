import React, { useRef } from 'react';
import { CheckCircle, Flame, ArrowUpRight } from 'lucide-react';
import { useGsapAnimation, gsap } from '../hooks/useGsapAnimation';

export const Testimonials = () => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);

  useGsapAnimation((ctx, isReducedMotion) => {
    if (isReducedMotion) {
      gsap.set(cardRef.current, { opacity: 1, scale: 1 });
      return;
    }

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, scale: 0.95, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          once: true,
        },
      }
    );
  });

  const bullets = [
    'Custom AI voice agent for your business',
    'Full appointment booking automation',
    'Emergency call handling',
    'Call summaries and monthly reports',
    'Priority support and optimization',
  ];

  return (
    <section
      id="early-access"
      ref={containerRef}
      className="bg-primary-bg py-24 px-4 sm:px-6 lg:px-8 relative"
      aria-label="Founding Client Program"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-accent-primary text-sm font-semibold uppercase tracking-[3px] mb-3">
            EARLY ACCESS
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-white leading-tight mb-4">
            Be a Founding Client
          </h2>
          <p className="text-text-muted text-lg sm:text-xl font-normal">
            We're onboarding our first 10 clients at a special rate
          </p>
        </div>

        {/* Founding Client Card */}
        <div
          ref={cardRef}
          className="max-w-2xl mx-auto bg-card-bg rounded-2xl p-8 sm:p-12 border border-border-divider shadow-2xl relative overflow-hidden"
        >
          {/* Top highlight glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent-primary/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-secondary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center sm:text-left">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/15 border border-accent-primary/30 text-accent-primary text-xs font-bold uppercase tracking-wider mb-4">
              <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
              Limited Intake
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Founding Client Program
            </h3>

            {/* Pricing Comparison */}
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-2">
              <span className="text-2xl text-status-danger line-through font-semibold">
                $1,500 setup
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-status-success">
                Free setup for our first 10 clients
              </span>
            </div>

            <p className="text-[#94A3B8] text-base mb-8">
              Only pay the monthly retainer — <span className="text-white font-semibold">$300/month</span>
            </p>

            {/* Bullets List */}
            <div className="space-y-4 mb-10 text-left">
              {bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-status-success flex-shrink-0 mt-0.5" />
                  <span className="text-text-body text-base font-medium">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex flex-col items-center">
              <a
                href="https://calendly.com/saadakhtar2222/ai-receptionist-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-primary-hover text-white text-lg font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-indigo-500/25 active:scale-98"
              >
                <span>Claim Your Spot</span>
                <ArrowUpRight className="w-5 h-5 opacity-90" />
              </a>

              {/* Urgency Badge */}
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#F59E0B]">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" />
                <span>3 of 10 spots remaining</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
