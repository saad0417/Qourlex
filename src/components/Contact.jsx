import React, { useState, useRef } from 'react';
import {
  CalendarCheck,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { LinkedInIcon, InstagramIcon, FacebookIcon } from './SocialIcons';
import { useGsapAnimation, gsap, revealOffset } from '../hooks/useGsapAnimation';
import { sendContactMessage } from '../utils/emailjs';

export const Contact = () => {
  const containerRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  useGsapAnimation((ctx, isReducedMotion) => {
    if (isReducedMotion) {
      gsap.set([leftColRef.current, rightColRef.current], { opacity: 1, x: 0 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
        once: true,
      },
    });

    // Form slides in from left, info from right
    tl.fromTo(
      leftColRef.current,
      { opacity: 0, ...revealOffset(-40, 1024) },
      { opacity: 1, x: 0, y: 0, duration: 0.7, ease: 'power3.out' }
    );

    tl.fromTo(
      rightColRef.current,
      { opacity: 0, ...revealOffset(40, 1024) },
      { opacity: 1, x: 0, y: 0, duration: 0.7, ease: 'power3.out' },
      '-=0.5'
    );
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (status.error) {
      setStatus((prev) => ({ ...prev, error: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validations
    if (!formData.name.trim()) {
      setStatus({ loading: false, success: false, error: 'Please enter your name.' });
      return;
    }

    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      setStatus({ loading: false, success: false, error: 'Please enter a valid email address.' });
      return;
    }

    setStatus({ loading: true, success: false, error: null });

    try {
      const result = await sendContactMessage(formData);
      if (result.success) {
        setStatus({ loading: false, success: true, error: null });
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: '',
        });
      } else {
        setStatus({
          loading: false,
          success: false,
          error: result.message || 'Something went wrong. Please try again or email us directly.',
        });
      }
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: 'Something went wrong. Please try again or email us directly.',
      });
    }
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="py-24 px-4 sm:px-6 lg:px-8 relative"
      style={{
        background: 'linear-gradient(180deg, #0F172A 0%, #030712 100%)',
      }}
      aria-label="Contact and Demo Scheduling"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-accent-primary text-sm font-semibold uppercase tracking-[3px] mb-3">
            GET STARTED
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-white leading-tight mb-4">
            Ready to Stop Missing Calls?
          </h2>
          <p className="text-text-muted text-lg sm:text-xl font-normal max-w-2xl mx-auto">
            Book a free 15-minute demo or send us a message. We'll show you exactly how Qourlex AI works for your business.
          </p>
        </div>

        {/* Two Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column — Contact Form (7 cols) */}
          <div
            ref={leftColRef}
            className="lg:col-span-7 bg-card-bg rounded-2xl p-6 sm:p-10 border border-border-divider shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-2">
              Send us a Message
            </h3>
            <p className="text-sm text-[#94A3B8] mb-8">
              Fill out the form below and an AI implementation specialist will contact you.
            </p>

            {/* Success Banner */}
            {status.success && (
              <div className="mb-6 p-4 rounded-xl bg-status-success/15 border border-status-success/30 text-status-success flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">
                  Message sent! We'll get back to you within 24 hours.
                </p>
              </div>
            )}

            {/* Error Banner */}
            {status.error && (
              <div className="mb-6 p-4 rounded-xl bg-status-danger/15 border border-status-danger/30 text-status-danger flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{status.error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
                    Your Name <span className="text-status-danger">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Miller"
                    className="w-full bg-[#0F172A] border border-border-divider rounded-lg p-4 text-white placeholder-[#64748B] focus:border-accent-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
                    Email Address <span className="text-status-danger">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@apexplumbing.com"
                    className="w-full bg-[#0F172A] border border-border-divider rounded-lg p-4 text-white placeholder-[#64748B] focus:border-accent-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Phone and Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 000-0000"
                    className="w-full bg-[#0F172A] border border-border-divider rounded-lg p-4 text-white placeholder-[#64748B] focus:border-accent-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
                    Company Name
                  </label>
                  <input
                    id="company"
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Apex Plumbing Services"
                    className="w-full bg-[#0F172A] border border-border-divider rounded-lg p-4 text-white placeholder-[#64748B] focus:border-accent-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Row 3: Message */}
              <div>
                <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
                  How can we help?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your call volume, current setup, or questions..."
                  className="w-full bg-[#0F172A] border border-border-divider rounded-lg p-4 text-white placeholder-[#64748B] focus:border-accent-primary focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status.loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-primary-hover disabled:opacity-60 text-white text-base font-semibold py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-98 cursor-pointer"
              >
                {status.loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Message</span>
                )}
              </button>
            </form>
          </div>

          {/* Right Column — Contact Info + CTA (5 cols) */}
          <div ref={rightColRef} className="lg:col-span-5 space-y-6">
            {/* Book a Demo Section */}
            <div className="bg-card-bg rounded-2xl p-6 sm:p-8 border border-border-divider shadow-xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent-primary/15 flex items-center justify-center flex-shrink-0">
                  <CalendarCheck className="w-7 h-7 text-accent-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">
                    Book a Demo Call
                  </h4>
                  <p className="text-sm text-[#94A3B8]">
                    Schedule a free 15-minute demo to hear your custom AI receptionist in action.
                  </p>
                </div>
              </div>

              <a
                href="https://calendly.com/saadakhtar2222/ai-receptionist-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center justify-center gap-2 w-full bg-accent-primary hover:bg-accent-primary-hover text-white text-sm font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02]"
              >
                <span>Book Now</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Email Us Section */}
            <div className="bg-card-bg rounded-2xl p-6 sm:p-8 border border-border-divider shadow-xl">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-accent-secondary/15 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-7 h-7 text-accent-secondary" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-lg font-bold text-white mb-0.5">
                    Email Us
                  </h4>
                  <a
                    href="mailto:saadakhtar2222@gmail.com"
                    className="inline-block py-1.5 -my-1.5 text-text-link hover:underline text-[13px] xs:text-sm sm:text-base font-medium transition-colors break-all"
                  >
                    saadakhtar2222@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Call or WhatsApp Section */}
            <div className="bg-card-bg rounded-2xl p-6 sm:p-8 border border-border-divider shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-status-success/15 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-7 h-7 text-status-success" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-0.5">
                    Call or WhatsApp
                  </h4>
                  <a
                    href="tel:+923196515639"
                    className="inline-block py-1.5 -my-1.5 text-text-link hover:underline text-sm sm:text-base font-medium transition-colors whitespace-nowrap"
                  >
                    +92 319 6515639
                  </a>
                </div>
              </div>
            </div>

            {/* Follow Us Section */}
            <div className="bg-card-bg rounded-2xl p-6 border border-border-divider shadow-xl">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-4">
                Follow Us
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://linkedin.com/company/qourlexai"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Qourlex AI on LinkedIn"
                  className="w-10 h-10 rounded-full bg-[#0F172A] border border-border-divider flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-accent-primary hover:border-accent-primary transition-all duration-300"
                >
                  <LinkedInIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com/qourlex.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Qourlex AI on Instagram"
                  className="w-10 h-10 rounded-full bg-[#0F172A] border border-border-divider flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-accent-primary hover:border-accent-primary transition-all duration-300"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com/qourlexai"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Qourlex AI on Facebook"
                  className="w-10 h-10 rounded-full bg-[#0F172A] border border-border-divider flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-accent-primary hover:border-accent-primary transition-all duration-300"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
