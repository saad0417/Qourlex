import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { Logo } from './Logo';
import { LinkedInIcon, InstagramIcon, FacebookIcon } from './SocialIcons';

export const Footer = () => {
  const quickLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Services', href: '#services' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer
      className="bg-primary-bg border-t border-border-card py-16 px-4 sm:px-6 lg:px-8 relative"
      aria-label="Footer"
    >
      <div className="max-w-7xl mx-auto">
        {/* Three Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          {/* Column 1 — Brand (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Logo />
            <p className="text-[#64748B] text-sm leading-relaxed max-w-sm">
              Every Ring Answered. Every Lead Captured. Every Job Booked.
            </p>
            <p className="text-[#64748B] text-sm">
              AI voice agents for home service businesses
            </p>
          </div>

          {/* Column 2 — Quick Links (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-[2px] text-text-muted mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="inline-block py-1.5 text-[#64748B] hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Connect (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[2px] text-text-muted mb-4">
              Connect
            </h4>
            <p className="flex items-center gap-2 text-sm text-[#94A3B8]">
              <Mail className="w-4 h-4 text-accent-primary flex-shrink-0" />
              <a
                href="mailto:saadakhtar2222@gmail.com"
                className="hover:text-white transition-colors"
              >
                saadakhtar2222@gmail.com
              </a>
            </p>
            <p className="flex items-center gap-2 text-sm text-[#94A3B8]">
              <Phone className="w-4 h-4 text-status-success flex-shrink-0" />
              <a
                href="tel:+923196515639"
                className="hover:text-white transition-colors"
              >
                +92 319 6515639
              </a>
            </p>

            {/* Social Icons Row */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href="https://linkedin.com/company/qourlexai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-card-bg border border-border-divider flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-accent-primary hover:border-accent-primary transition-all duration-200"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/qourlex.ai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-card-bg border border-border-divider flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-accent-primary hover:border-accent-primary transition-all duration-200"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/qourlex"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-card-bg border border-border-divider flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-accent-primary hover:border-accent-primary transition-all duration-200"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border-card flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#64748B]">
          <p>© 2026 Qourlex AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
