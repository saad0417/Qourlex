import React from 'react';

export const LogoIcon = ({ className = 'w-9 h-9' }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Subtle outer glow layer */}
    <circle cx="18" cy="18" r="14" fill="#4F46E5" fillOpacity="0.15" />
    
    {/* Q outer ring */}
    <circle
      cx="18"
      cy="18"
      r="13"
      stroke="#FFFFFF"
      strokeWidth="3.2"
      strokeLinecap="round"
      className="transition-colors duration-300 group-hover:stroke-indigo-400"
    />
    
    {/* Q diagonal leg in vibrant indigo/purple */}
    <path
      d="M27 27L36 36"
      stroke="#4F46E5"
      strokeWidth="3.8"
      strokeLinecap="round"
    />

    {/* Voice waveform bars inside Q */}
    <line
      x1="13"
      y1="14"
      x2="13"
      y2="22"
      stroke="#4F46E5"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <line
      x1="18"
      y1="10"
      x2="18"
      y2="26"
      stroke="#818CF8"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <line
      x1="23"
      y1="13"
      x2="23"
      y2="23"
      stroke="#7C3AED"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

export const Logo = ({ withText = true, className = '', iconClassName = 'w-9 h-9' }) => {
  return (
    <a
      href="#hero"
      className={`group inline-flex items-center gap-2.5 transition-transform duration-200 hover:opacity-95 focus:outline-none ${className}`}
      aria-label="Qourlex AI Home"
    >
      <LogoIcon className={iconClassName} />
      {withText && (
        <span className="font-bold text-xl tracking-tight text-white flex items-center">
          <span>QOURLEX</span>
          <span className="text-accent-primary ml-1.5 font-extrabold tracking-wider">AI</span>
        </span>
      )}
    </a>
  );
};

export default Logo;
