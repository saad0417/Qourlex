import React, { useRef } from 'react';
import { AnimatedCounter } from './AnimatedCounter';
import { useGsapAnimation, gsap } from '../hooks/useGsapAnimation';

export const Problem = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const paragraphRef = useRef(null);

  useGsapAnimation(
    (self, isReducedMotion) => {
      if (isReducedMotion) {
        gsap.set(cardsRef.current, { opacity: 1, y: 0 });
        if (paragraphRef.current) gsap.set(paragraphRef.current, { opacity: 1 });
        return;
      }

      const validCards = cardsRef.current.filter(Boolean);
      if (validCards.length > 0) {
        gsap.fromTo(
          validCards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }

      if (paragraphRef.current) {
        gsap.fromTo(
          paragraphRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.45,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }
    },
    [],
    containerRef
  );

  return (
    <section
      id="problem"
      ref={containerRef}
      className="bg-secondary-bg py-24 px-4 sm:px-6 lg:px-8 relative border-t border-b border-white/10"
      aria-label="The Missed Call Problem"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-accent-primary text-xs sm:text-sm font-bold uppercase tracking-[3px] mb-3">
            THE PROBLEM
          </p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[48px] text-white leading-tight">
            Your Customers Are Calling. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-accent-primary">
              Who's Answering?
            </span>
          </h2>
        </div>

        {/* 3 Apple Glass Stat Cards - equal uniform height & refined width */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[890px] mx-auto items-stretch">
          {/* Card 1 */}
          <div
            ref={(el) => { cardsRef.current[0] = el; }}
            className="apple-glass-card rounded-2xl py-7 px-4 text-center border border-white/15 flex flex-col justify-center items-center group relative overflow-hidden max-w-[275px] sm:max-w-none mx-auto w-full min-h-[190px] h-full"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-primary to-transparent opacity-60" />
            <div className="h-12 flex items-center justify-center mb-3 w-full">
              <div className="font-display text-4xl sm:text-5xl md:text-[46px] font-extrabold text-accent-primary leading-none group-hover:scale-105 transition-transform duration-300">
                <AnimatedCounter end={78} suffix="%" duration={2} />
              </div>
            </div>
            <p className="text-text-muted text-xs sm:text-sm leading-relaxed max-w-[210px] mx-auto min-h-[38px] flex items-center justify-center">
              of customers hire the first company that answers
            </p>
          </div>

          {/* Card 2 */}
          <div
            ref={(el) => { cardsRef.current[1] = el; }}
            className="apple-glass-card rounded-2xl py-7 px-4 text-center border border-white/15 flex flex-col justify-center items-center group relative overflow-hidden max-w-[275px] sm:max-w-none mx-auto w-full min-h-[190px] h-full"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-status-danger to-transparent opacity-60" />
            <div className="h-12 flex items-center justify-center mb-3 w-full">
              <div className="font-display text-[28px] xs:text-3xl sm:text-[34px] md:text-[36px] lg:text-[38px] font-extrabold text-status-danger leading-none tracking-tight whitespace-nowrap group-hover:scale-105 transition-transform duration-300">
                <AnimatedCounter end={50000} prefix="$" suffix="+" duration={2.2} />
              </div>
            </div>
            <p className="text-text-muted text-xs sm:text-sm leading-relaxed max-w-[210px] mx-auto min-h-[38px] flex items-center justify-center">
              lost per year from missed calls
            </p>
          </div>

          {/* Card 3 */}
          <div
            ref={(el) => { cardsRef.current[2] = el; }}
            className="apple-glass-card rounded-2xl py-7 px-4 text-center border border-white/15 flex flex-col justify-center items-center group relative overflow-hidden max-w-[275px] sm:max-w-none mx-auto w-full min-h-[190px] h-full"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-secondary to-transparent opacity-60" />
            <div className="h-12 flex items-center justify-center mb-3 w-full">
              <div className="font-display text-4xl sm:text-5xl md:text-[46px] font-extrabold text-accent-secondary leading-none group-hover:scale-105 transition-transform duration-300">
                <AnimatedCounter end={62} suffix="%" duration={1.8} />
              </div>
            </div>
            <p className="text-text-muted text-xs sm:text-sm leading-relaxed max-w-[210px] mx-auto min-h-[38px] flex items-center justify-center">
              of calls go unanswered after business hours
            </p>
          </div>
        </div>

        {/* Paragraph Below Cards */}
        <div
          ref={paragraphRef}
          className="max-w-[700px] mx-auto text-center mt-12 px-4"
        >
          <p className="text-lg text-text-muted leading-relaxed apple-glass-pill py-4 px-6 rounded-2xl inline-block">
            Every missed call is a lost job. Your competitors answer first. Voicemail doesn't book appointments.{' '}
            <span className="text-white font-semibold">Qourlex AI does.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Problem;
