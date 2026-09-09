import React, { useState, useRef } from 'react';
import { Wrench, Thermometer, Zap, Home, MessageSquare } from 'lucide-react';
import { useGsapAnimation, gsap, revealOffset } from '../hooks/useGsapAnimation';

export const Industries = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const [activeCard, setActiveCard] = useState(null);

  useGsapAnimation(
    (self, isReducedMotion) => {
      if (isReducedMotion) {
        gsap.set(cardsRef.current, { opacity: 1, x: 0 });
        return;
      }

      const validCards = cardsRef.current.filter(Boolean);
      validCards.forEach((card, index) => {
        const fromX = index % 2 === 0 ? -40 : 40;
        gsap.fromTo(
          card,
          { opacity: 0, ...revealOffset(fromX, 640) },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 75%',
              once: true,
            },
            delay: index * 0.12,
          }
        );
      });
    },
    [],
    containerRef
  );

  const industries = [
    {
      title: 'Plumbing',
      icon: Wrench,
      color: '#3B82F6',
      examples: [
        '“My pipe burst”',
        '“Drain is clogged”',
        '“Water heater leaking”',
      ],
    },
    {
      title: 'HVAC',
      icon: Thermometer,
      color: '#8B5CF6',
      examples: [
        '“AC stopped working”',
        '“No heat”',
        '“Furnace noise”',
      ],
    },
    {
      title: 'Electrical',
      icon: Zap,
      color: '#F59E0B',
      examples: [
        '“Outlet sparking”',
        '“Power out”',
        '“Breaker keeps tripping”',
      ],
    },
    {
      title: 'Roofing',
      icon: Home,
      color: '#10B981',
      examples: [
        '“Roof is leaking”',
        '“Storm damage”',
        '“Need inspection”',
      ],
    },
  ];

  return (
    <section
      id="industries"
      ref={containerRef}
      className="bg-primary-bg py-24 px-4 sm:px-6 lg:px-8 relative"
      aria-label="Industries"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-accent-primary text-sm font-semibold uppercase tracking-[3px] mb-3">
            INDUSTRIES
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-white leading-tight mb-4">
            Built for the Trades
          </h2>
          <p className="text-text-muted text-lg sm:text-xl font-normal">
            AI receptionists that speak your customer's language
          </p>
        </div>

        {/* 4 Industry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((item, index) => {
            const Icon = item.icon;
            const isFlipped = activeCard === index;

            return (
              <div
                key={index}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="perspective-1000 h-72 cursor-pointer select-none"
                onClick={() => setActiveCard(isFlipped ? null : index)}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
                tabIndex={0}
                role="button"
                aria-label={`${item.title} industry card. Click or hover to view typical call scenarios.`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveCard(isFlipped ? null : index);
                  }
                }}
              >
                <div
                  className={`relative w-full h-full duration-500 rounded-xl transition-all [transform-style:preserve-3d] ${
                    isFlipped ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* Front Face: Icon + Title */}
                  <div className="absolute inset-0 bg-card-bg rounded-xl p-8 text-center border border-border-divider flex flex-col items-center justify-center [backface-visibility:hidden] shadow-xl hover:border-accent-primary/50 transition-colors">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${item.color}1A`,
                      }}
                    >
                      <Icon size={32} style={{ color: item.color }} strokeWidth={2} />
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#64748B] flex items-center gap-1.5 mt-2 font-medium">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Hover to hear caller types
                    </p>
                  </div>

                  {/* Back Face: Example Caller Phrases */}
                  <div
                    className="absolute inset-0 bg-[#1E293B] rounded-xl p-6 text-center border border-border-divider flex flex-col items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-2xl"
                    style={{
                      borderColor: item.color,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Icon size={18} style={{ color: item.color }} />
                      <span className="text-sm font-semibold text-white uppercase tracking-wider">
                        {item.title} Inquiries
                      </span>
                    </div>

                    <div className="space-y-2.5 w-full">
                      {item.examples.map((phrase, pIdx) => (
                        <div
                          key={pIdx}
                          className="bg-[#0F172A] px-3.5 py-2 rounded-lg text-xs font-medium text-[#E2E8F0] border border-[#334155]/60 text-left flex items-center gap-2"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span>{phrase}</span>
                        </div>
                      ))}
                    </div>

                    <span className="text-[11px] text-accent-primary mt-3 font-medium">
                      Understood & Dispatched 24/7
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Industries;
