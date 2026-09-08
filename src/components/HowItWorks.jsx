import React, { useRef } from 'react';
import { Phone, CalendarCheck, BellRing } from 'lucide-react';
import { useGsapAnimation, gsap } from '../hooks/useGsapAnimation';

export const HowItWorks = () => {
  const containerRef = useRef(null);
  const stepsRef = useRef([]);
  const pathRef = useRef(null);

  useGsapAnimation(
    (self, isReducedMotion) => {
      if (isReducedMotion) {
        gsap.set(stepsRef.current, { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      if (pathRef.current) {
        const length = pathRef.current.getTotalLength ? pathRef.current.getTotalLength() : 600;
        gsap.set(pathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        tl.to(pathRef.current, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: 'power2.inOut',
        });
      }

      const validSteps = stepsRef.current.filter(Boolean);
      if (validSteps.length > 0) {
        tl.fromTo(
          validSteps,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.2,
            ease: 'power3.out',
          },
          pathRef.current ? '-=0.9' : 0
        );
      }
    },
    [],
    containerRef
  );

  const steps = [
    {
      number: '01',
      icon: Phone,
      iconColor: '#4F46E5',
      iconBg: 'bg-[#4F46E5]/10',
      title: 'Customer Calls',
      description:
        'AI picks up in under 2 seconds with a warm, natural voice. No hold music. No voicemail. Just a friendly greeting.',
    },
    {
      number: '02',
      icon: CalendarCheck,
      iconColor: '#7C3AED',
      iconBg: 'bg-[#7C3AED]/10',
      title: 'Appointment Booked',
      description:
        'Service call scheduled directly into your Google Calendar, Calendly, or CRM. Customer gets confirmation. You get notified.',
    },
    {
      number: '03',
      icon: BellRing,
      iconColor: '#10B981',
      iconBg: 'bg-[#10B981]/10',
      title: "You're Notified",
      description:
        'Full call summary delivered via text and email instantly. Name, number, issue, urgency — everything you need.',
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="bg-primary-bg py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      aria-label="How It Works"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-accent-primary text-sm font-semibold uppercase tracking-[3px] mb-3">
            HOW IT WORKS
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-white leading-tight mb-4">
            Three Steps. That's It.
          </h2>
          <p className="text-text-muted text-lg sm:text-xl font-normal">
            From missed call to booked job in seconds
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Desktop SVG Connecting Line */}
          <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-2 pointer-events-none z-0">
            <svg className="w-full h-4 overflow-visible" preserveAspectRatio="none">
              <path
                ref={pathRef}
                d="M 0 8 L 800 8"
                stroke="#334155"
                strokeWidth="2"
                strokeDasharray="6 6"
                fill="none"
              />
            </svg>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10">
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={idx}
                  ref={(el) => { stepsRef.current[idx] = el; }}
                  className="flex flex-col items-center text-center relative"
                >
                  {/* Mobile Vertical Connecting Line */}
                  {idx < steps.length - 1 && (
                    <div
                      className="md:hidden absolute top-16 bottom-[-48px] left-1/2 -translate-x-1/2 w-0.5 border-l-2 border-dashed border-border-divider -z-10"
                      aria-hidden="true"
                    />
                  )}

                  {/* Step Number Circle */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg text-white mb-5 bg-[#030712] transition-transform duration-300 hover:scale-110 shadow-lg"
                    style={{
                      border: `2px solid ${step.iconColor}`,
                      boxShadow: `0 0 20px ${step.iconColor}25`,
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Lucide Icon */}
                  <div className={`p-3.5 rounded-xl ${step.iconBg} mb-5 flex items-center justify-center`}>
                    <IconComponent size={32} style={{ color: step.iconColor }} strokeWidth={2} />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-text-muted text-base leading-relaxed max-w-sm">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
