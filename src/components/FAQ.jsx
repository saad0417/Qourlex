import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useGsapAnimation, gsap } from '../hooks/useGsapAnimation';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const containerRef = useRef(null);
  const faqItemsRef = useRef([]);

  useGsapAnimation(
    (self, isReducedMotion) => {
      if (isReducedMotion) {
        gsap.set(faqItemsRef.current, { opacity: 1, y: 0 });
        return;
      }

      const validItems = faqItemsRef.current.filter(Boolean);
      if (validItems.length > 0) {
        gsap.fromTo(
          validItems,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
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

  const faqs = [
    {
      q: 'How does the AI receptionist work?',
      a: "When a customer calls your business number, our AI picks up instantly. It greets them naturally, understands what they need, books appointments, answers common questions, and alerts you for emergencies. It's like having a full-time receptionist who never takes a break.",
    },
    {
      q: 'Does it sound like a real person?',
      a: 'Yes. We use the latest voice AI technology that sounds natural and conversational — warm, friendly, and professional. Most callers won\'t know they\'re speaking to AI.',
    },
    {
      q: 'What if the caller needs to speak to a real person?',
      a: 'The AI recognizes when a call needs human attention — billing disputes, complex technical questions, or a caller who specifically asks for someone. It takes their information and notifies you instantly for a callback.',
    },
    {
      q: 'How long does setup take?',
      a: 'We can have your AI receptionist live and answering calls within 48 to 72 hours of onboarding. We handle everything — you just review and approve.',
    },
    {
      q: 'What tools does it integrate with?',
      a: 'Google Calendar, Calendly, HubSpot, ServiceTitan, Housecall Pro, Jobber, QuickBooks, and many more. If your business uses it, we can likely connect to it.',
    },
    {
      q: 'Can I try it before committing?',
      a: 'Absolutely. Book a free demo call and we\'ll build a sample AI receptionist for your business so you can hear it in action before you pay anything.',
    },
    {
      q: 'What happens during an emergency call?',
      a: 'The AI detects emergencies like gas leaks, burst pipes, no heat, or electrical hazards. It immediately collects the caller\'s info, advises them on safety steps, and alerts you via text, email, or phone call — all within seconds.',
    },
    {
      q: 'Is there a contract or commitment?',
      a: 'No long-term contracts. Month-to-month after the initial setup. Cancel anytime — but we\'re confident you won\'t want to.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      ref={containerRef}
      className="bg-primary-bg py-24 px-4 sm:px-6 lg:px-8 relative"
      aria-label="Frequently Asked Questions"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-accent-primary text-sm font-semibold uppercase tracking-[3px] mb-3">
            FAQ
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-white leading-tight">
            Questions? We've Got Answers.
          </h2>
        </div>

        {/* Accordion FAQ Container */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                ref={(el) => { faqItemsRef.current[index] = el; }}
                className="bg-card-bg rounded-xl border border-border-divider overflow-hidden transition-colors duration-200"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:bg-card-hover"
                  aria-expanded={isOpen}
                >
                  <span className="text-white text-lg font-semibold pr-2">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#94A3B8] transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-accent-primary' : ''
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="p-6 pt-0 text-[#94A3B8] text-base leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
