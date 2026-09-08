import React, { useRef } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useGsapAnimation, gsap } from '../hooks/useGsapAnimation';

export const Pricing = () => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const noteRef = useRef(null);

  useGsapAnimation((ctx, isReducedMotion) => {
    if (isReducedMotion) {
      gsap.set([cardRef.current, noteRef.current], { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
        once: true,
      },
    });

    tl.fromTo(
      cardRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
    );

    tl.fromTo(
      noteRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    );
  });

  const features = [
    'Custom AI voice agent trained for your business',
    '24/7 call answering with natural voice',
    'Appointment booking into your calendar',
    'Emergency call detection and instant alerts',
    'Lead capture into your CRM or spreadsheet',
    'Call summaries via text and email',
    'Monthly performance reports',
    'Ongoing optimization and support',
  ];

  return (
    <section
      id="pricing"
      ref={containerRef}
      className="bg-secondary-bg py-24 px-4 sm:px-6 lg:px-8 relative border-t border-border-card"
      aria-label="Pricing"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-accent-primary text-sm font-semibold uppercase tracking-[3px] mb-3">
            PRICING
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-white leading-tight mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-text-muted text-lg sm:text-xl font-normal">
            No hidden fees. No long contracts. Cancel anytime.
          </p>
        </div>

        {/* Single Pricing Card */}
        <div
          ref={cardRef}
          className="max-w-lg mx-auto bg-card-bg rounded-2xl border border-border-divider overflow-hidden shadow-2xl transition-all duration-300 hover:border-accent-primary/50"
        >
          {/* Top Section Header with gradient */}
          <div className="bg-gradient-to-r from-accent-primary to-accent-secondary p-8 text-white relative">
            <h3 className="text-2xl sm:text-[28px] font-bold leading-tight mb-1">
              AI Receptionist
            </h3>
            <p className="text-white/85 text-base">
              Everything you need to never miss a call
            </p>
          </div>

          {/* Card Body */}
          <div className="p-8 sm:p-10">
            {/* Price Header */}
            <div className="mb-8 pb-8 border-b border-border-divider">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl sm:text-[48px] font-extrabold text-white tracking-tight leading-none">
                  $1,500
                </span>
                <span className="text-[#94A3B8] text-base font-normal">
                  one-time setup
                </span>
              </div>
              <p className="text-[#94A3B8] text-xl font-medium mt-1">
                + $300–$500/month
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-4 mb-10">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <CheckCircle className="w-5 h-5 text-status-success flex-shrink-0 mt-0.5" />
                  <span className="text-text-body text-base font-normal leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Full-width CTA Button */}
            <a
              href="https://calendly.com/saadakhtar2222/ai-receptionist-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-primary-hover text-white text-base sm:text-lg font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-indigo-500/25 active:scale-98"
            >
              <span>Book a Free Demo</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Below Card Note */}
        <div ref={noteRef} className="mt-12 text-center">
          <p className="text-[#94A3B8] text-lg italic max-w-xl mx-auto leading-relaxed">
            “Your receptionist costs $3,500/month. Our AI costs a fraction. Do the math.”
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
