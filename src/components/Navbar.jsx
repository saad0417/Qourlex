import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { Logo } from './Logo';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const mobileMenuRef = useRef(null);
  const linksRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      setScrolled(scrollPos > 30);

      const sections = ['hero', 'problem', 'how-it-works', 'services', 'industries', 'comparison', 'pricing', 'faq', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const tl = gsap.timeline();
      tl.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
      const validLinks = linksRef.current.filter(Boolean);
      if (validLinks.length > 0) {
        tl.fromTo(
          validLinks,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'power3.out' },
          '-=0.15'
        );
      }
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '#hero', id: 'hero' },
    { label: 'How It Works', href: '#how-it-works', id: 'how-it-works' },
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'Pricing', href: '#pricing', id: 'pricing' },
    { label: 'FAQ', href: '#faq', id: 'faq' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleLinkClick = () => {
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-300 ${
          scrolled
            ? 'apple-glass-nav'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation Links in Apple Glass Capsule */}
          <nav
            className="hidden md:flex items-center space-x-1 px-4 py-1.5 rounded-full apple-glass-pill"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`relative text-[14px] font-medium px-3.5 py-1 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-white/10 shadow-sm'
                      : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-primary"
                      aria-hidden="true"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Button with iOS specular sheen */}
          <div className="hidden md:flex items-center">
            <a
              href="https://calendly.com/saadakhtar2222/ai-receptionist-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-accent-primary hover:bg-accent-primary-hover text-white text-[14px] font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-md shadow-indigo-500/25 border border-white/20 relative overflow-hidden group active:scale-95"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span>Book a Demo</span>
              <ArrowUpRight className="w-4 h-4 ml-1 opacity-85" />
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-[#94A3B8] hover:text-white apple-glass-pill transition-colors focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Navigation Overlay (Apple Liquid Glass) */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-40 bg-[#030712]/95 backdrop-blur-2xl flex flex-col justify-between pt-24 pb-12 px-6 md:hidden border-b border-white/10"
        >
          <nav className="flex flex-col items-center justify-center space-y-5 my-auto" aria-label="Mobile Navigation">
            {navLinks.map((link, idx) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  ref={(el) => { linksRef.current[idx] = el; }}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`font-display text-2xl font-bold tracking-tight transition-colors py-2 flex items-center gap-2 ${
                    isActive ? 'text-white' : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && <span className="w-2 h-2 rounded-full bg-accent-primary" />}
                </a>
              );
            })}
          </nav>

          <div
            ref={(el) => { linksRef.current[navLinks.length] = el; }}
            className="w-full max-w-sm mx-auto flex flex-col items-center gap-4"
          >
            <a
              href="https://calendly.com/saadakhtar2222/ai-receptionist-demo"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              className="w-full text-center bg-accent-primary hover:bg-accent-primary-hover text-white text-base font-semibold py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all border border-white/20"
            >
              Book a Demo
            </a>
            <p className="text-xs text-[#64748B] text-center">
              Available 24/7 for Home Service Businesses
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
