import React, { useRef } from 'react';
import {
  X,
  Check,
  DollarSign,
  Clock,
  Coffee,
  PhoneOff,
  XCircle,
  Shield,
  PhoneCall,
  CheckCircle,
} from 'lucide-react';
import { useGsapAnimation, gsap, revealOffset } from '../hooks/useGsapAnimation';

export const Comparison = () => {
  const containerRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const calloutRef = useRef(null);

  useGsapAnimation((ctx, isReducedMotion) => {
    if (isReducedMotion) {
      gsap.set([leftColRef.current, rightColRef.current, calloutRef.current], {
        opacity: 1,
        x: 0,
        y: 0,
      });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
        once: true,
      },
    });

    // Left column slides in from left
    tl.fromTo(
      leftColRef.current,
      { opacity: 0, ...revealOffset(-50, 768) },
      { opacity: 1, x: 0, y: 0, duration: 0.7, ease: 'power3.out' }
    );

    // Right column slides in from right
    tl.fromTo(
      rightColRef.current,
      { opacity: 0, ...revealOffset(50, 768) },
      { opacity: 1, x: 0, y: 0, duration: 0.7, ease: 'power3.out' },
      '-=0.5'
    );

    // Bottom callout fades in after
    tl.fromTo(
      calloutRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.2'
    );
  });

  const humanRows = [
    { text: '$3,500/month', icon: DollarSign },
    { text: '8 hours/day', icon: Clock },
    { text: 'Sick days, vacations, lunch breaks', icon: Coffee },
    { text: '1 call at a time', icon: PhoneOff },
    { text: 'Misses after-hours calls', icon: XCircle },
  ];

  const aiRows = [
    { text: 'Fraction of the cost', icon: DollarSign },
    { text: '24/7/365', icon: Clock },
    { text: 'Never sick, never late, never quits', icon: Shield },
    { text: 'Unlimited simultaneous calls', icon: PhoneCall },
    { text: 'Zero missed calls. Ever.', icon: CheckCircle },
  ];

  return (
    <section
      id="comparison"
      ref={containerRef}
      className="bg-secondary-bg py-24 px-4 sm:px-6 lg:px-8 relative border-t border-border-card"
      aria-label="Comparison: Human vs AI Receptionist"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-accent-primary text-sm font-semibold uppercase tracking-[3px] mb-3">
            COMPARISON
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-white leading-tight">
            The Math Is Simple
          </h2>
        </div>

        {/* Two-Column Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column — Human Receptionist */}
          <div
            ref={leftColRef}
            className="bg-card-bg/90 rounded-2xl p-6 sm:p-8 lg:p-10 border border-border-divider relative overflow-hidden shadow-xl"
            style={{
              borderTop: '3px solid #EF4444',
              backgroundColor: 'rgba(30, 41, 59, 0.85)',
            }}
          >
            {/* Subtle red gradient accent at top */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-status-danger/10 to-transparent pointer-events-none" />

            <div className="flex flex-wrap items-center gap-3 mb-8 min-h-[40px] relative z-10">
              <div className="w-10 h-10 rounded-full bg-status-danger/15 flex items-center justify-center flex-shrink-0">
                <X className="w-5 h-5 text-status-danger stroke-[2.5]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Human Receptionist
              </h3>
            </div>

            <div className="space-y-6 relative z-10">
              {humanRows.map((row, index) => {
                const Icon = row.icon;
                return (
                  <div key={index} className="flex items-start gap-3.5 sm:gap-4 py-2.5 border-b border-border-divider/50 last:border-0">
                    <div className="w-8 h-8 mt-0.5 rounded-lg bg-status-danger/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-status-danger" />
                    </div>
                    <span className="text-[#94A3B8] text-[15px] sm:text-lg font-medium text-pretty">
                      {row.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column — Qourlex AI */}
          <div
            ref={rightColRef}
            className="bg-card-bg/90 rounded-2xl p-6 sm:p-8 lg:p-10 border border-border-divider relative overflow-hidden shadow-2xl"
            style={{
              borderTop: '3px solid #10B981',
              backgroundColor: 'rgba(30, 41, 59, 0.85)',
            }}
          >
            {/* Subtle green gradient accent at top */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-status-success/10 to-transparent pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-3 mb-8 min-h-[40px] relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-status-success/15 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-status-success stroke-[2.5]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white whitespace-nowrap">
                  Qourlex AI
                </h3>
              </div>
              <span className="shrink-0 whitespace-nowrap text-[10px] sm:text-xs uppercase font-bold tracking-wider px-2.5 sm:px-3 py-1 rounded-full bg-status-success/15 text-status-success border border-status-success/30">
                Recommended
              </span>
            </div>

            <div className="space-y-6 relative z-10">
              {aiRows.map((row, index) => {
                const Icon = row.icon;
                return (
                  <div key={index} className="flex items-start gap-3.5 sm:gap-4 py-2.5 border-b border-border-divider/50 last:border-0">
                    <div className="w-8 h-8 mt-0.5 rounded-lg bg-status-success/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-status-success" />
                    </div>
                    <span className="text-[#E2E8F0] text-[15px] sm:text-lg font-semibold text-pretty">
                      {row.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Callout */}
        <div
          ref={calloutRef}
          className="bg-card-bg rounded-xl p-6 sm:p-8 mt-12 max-w-[700px] mx-auto text-center border border-border-divider shadow-lg relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 via-transparent to-accent-secondary/5 pointer-events-none" />
          <p className="text-base sm:text-lg text-[#E2E8F0] leading-relaxed relative z-10 font-medium">
            One missed call costs you <span className="text-white font-bold">$300–$800</span>. Qourlex AI pays for itself in the first week.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
