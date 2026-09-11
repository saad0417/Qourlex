import React from 'react';

/**
 * Exact vector mark traced directly from logo3.png with 100% transparent background:
 * Pure white Q ring, sharp diagonal tail, and five-bar electric voice waveform in the counter.
 */

const BARS = [
  { x: 34.03, y: 58.45, width: 7.32, height: 11.58, rx: 3.66 },
  { x: 45.30, y: 50.16, width: 7.32, height: 28.16, rx: 3.66 },
  { x: 56.64, y: 41.15, width: 7.32, height: 46.17, rx: 3.66 },
  { x: 68.06, y: 50.16, width: 7.32, height: 28.16, rx: 3.66 },
  { x: 79.32, y: 58.45, width: 7.32, height: 11.58, rx: 3.66 },
];

export const LogoIcon = ({ className = 'w-10 h-10', title }) => (
  <svg
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role={title ? 'img' : undefined}
    aria-label={title || undefined}
    aria-hidden={title ? undefined : 'true'}
  >
    <defs>
      {/* Electric indigo-violet gradient from logo3.png */}
      <linearGradient id="qourlex-bars-grad" x1="30" y1="40" x2="98" y2="88" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4F46E5" />
        <stop offset="50%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
    </defs>

    {/* Q Ring (100% Transparent Background, Pure White Stroke) */}
    <circle
      cx="60.4"
      cy="64.0"
      r="45.4"
      stroke="currentColor"
      strokeWidth="18.2"
      fill="none"
    />

    {/* Diagonal Tail matching exact logo3.png geometry */}
    <path
      d="M 68.75 88.54 L 86.93 88.54 L 122.0 118.14 L 95.13 118.14 Z"
      fill="currentColor"
    />

    {/* 5 Voice Waveform Bars in counter */}
    <g fill="url(#qourlex-bars-grad)">
      {BARS.map((bar, i) => (
        <rect
          key={i}
          x={bar.x}
          y={bar.y}
          width={bar.width}
          height={bar.height}
          rx={bar.rx}
        />
      ))}
    </g>
  </svg>
);

export const Logo = ({
  withText = true,
  className = '',
  iconClassName = 'w-10 h-10',
  href = '#hero',
}) => (
  <a
    href={href}
    className={`group inline-flex items-center gap-3 transition-opacity duration-200 hover:opacity-95 focus:outline-none ${className}`}
    aria-label="Qourlex AI home"
  >
    <LogoIcon className={`${iconClassName} text-white transition-colors duration-300 group-hover:text-[#F1F5F9] shrink-0`} />
    {withText && (
      <span className="brand-wordmark font-display text-xl sm:text-[22px] font-extrabold tracking-tight text-white flex items-center select-none">
        <span className="tracking-[0.03em]">QOURLEX</span>
        <span className="ml-1.5 text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] font-extrabold tracking-[0.05em]">AI</span>
      </span>
    )}
  </a>
);

export default Logo;
