import React, { useRef } from 'react';
import { Phone, CalendarPlus, AlertTriangle, UserPlus, Moon, FileText } from 'lucide-react';
import { useGsapAnimation, gsap } from '../hooks/useGsapAnimation';

export const Services = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useGsapAnimation(
    (self, isReducedMotion) => {
      if (isReducedMotion) {
        gsap.set(cardsRef.current, { opacity: 1, y: 0 });
        return;
      }

      const validCards = cardsRef.current.filter(Boolean);
      if (validCards.length > 0) {
        gsap.fromTo(
          validCards,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 75%',
              once: true,
            },
          }
        );
      }
    },
    [],
    containerRef
  );

  const services = [
    {
      icon: Phone,
      color: '#4F46E5',
      title: '24/7 Call Answering',
      description:
        'AI answers every call instantly with a natural, human-sounding voice. No hold music. No voicemail. Ever.',
    },
    {
      icon: CalendarPlus,
      color: '#7C3AED',
      title: 'Appointment Booking',
      description:
        'Books service calls, estimates, and consultations directly into your calendar in real-time while the customer is still on the phone.',
    },
    {
      icon: AlertTriangle,
      color: '#EF4444',
      title: 'Emergency Handling',
      description:
        'Detects urgent calls like gas leaks, burst pipes, or AC failures. Alerts you instantly via text, email, or phone.',
    },
    {
      icon: UserPlus,
      color: '#10B981',
      title: 'Lead Capture',
      description:
        "Every caller's name, number, job type, and urgency captured automatically and logged into your CRM or spreadsheet.",
    },
    {
      icon: Moon,
      color: '#818CF8',
      title: 'After-Hours Coverage',
      description:
        'Nights, weekends, holidays — your AI receptionist never clocks out. Capture jobs your competitors miss at 11pm.',
    },
    {
      icon: FileText,
      color: '#F59E0B',
      title: 'Call Summaries & Reports',
      description:
        'Detailed summary of every call via text and email. Monthly reports showing calls handled, jobs booked, revenue captured.',
    },
  ];

  return (
    <section
      id="services"
      ref={containerRef}
      className="bg-secondary-bg py-24 px-4 sm:px-6 lg:px-8 relative border-t border-border-card"
      aria-label="Services"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-accent-primary text-sm font-semibold uppercase tracking-[3px] mb-3">
            SERVICES
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-white leading-tight mb-4">
            What We Build for You
          </h2>
          <p className="text-text-muted text-lg sm:text-xl font-normal">
            Everything your receptionist does — at a fraction of the cost
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="bg-card-bg rounded-xl p-8 border border-border-divider transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl"
                style={{
                  borderLeft: `3px solid ${item.color}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = item.color;
                  e.currentTarget.style.borderLeftColor = item.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#334155';
                  e.currentTarget.style.borderLeftColor = item.color;
                }}
              >
                {/* Icon in 10% opacity container */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${item.color}1A`,
                  }}
                >
                  <Icon size={28} style={{ color: item.color }} strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-3 tracking-tight group-hover:text-white">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-text-muted text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
