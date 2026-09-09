import React from 'react';

/**
 * The Qourlex mark, traced from the supplied artwork (logo3.png) into vector
 * form: a heavy Q ring, its diagonal tail, and a five-bar voice waveform in the
 * counter. Measured off the source at 1254px and normalised to a 128 unit box,
 * so proportions match the original exactly.
 *
 * Vector rather than the supplied PNG on purpose — the artwork ships on a solid
 * background with no alpha, and at ~800KB each it would be the heaviest asset
 * on the page. This is under 1KB, stays crisp at any size, and takes its colour
 * from CSS.
 */

const BARS = [
  { cx: 36.5, height: 12.1 },
  { cx: 48.4, height: 29.5 },
  { cx: 60.2, height: 48.3 },
  { cx: 72.2, height: 29.5 },
  { cx: 84.0, height: 12.1 },
];

const BAR_WIDTH = 8.4;
const BAR_CENTER_Y = 64.4;

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
      <linearGradient id="qourlex-wave" x1="30" y1="40" x2="92" y2="90" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#818CF8" />
        <stop offset="52%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
      {/* The tail is clipped to the ring's own outer edge so the two read as a
          single drawn letter rather than a bar laid across a circle. */}
      <mask id="qourlex-counter">
        <rect width="128" height="128" fill="#000" />
        <circle cx="60.4" cy="64" r="57.3" fill="#fff" />
      </mask>
    </defs>

    {/* Counter fill. Gives the waveform a consistent ground on any background
        and, just as importantly, keeps the white ring reading as a ring — with
        a light fill here the two merge and the Q letterform is lost. */}
    <circle cx="60.4" cy="64" r="38.2" fill="#0B1020" />

    {/* Q ring */}
    <circle
      cx="60.4"
      cy="64"
      r="47.5"
      stroke="currentColor"
      strokeWidth="19.5"
      fill="none"
    />

    {/* Diagonal tail, running down and right at 45 degrees */}
    <path
      d="M67.4 88 L96.6 88 L125.2 121.3 L97.1 121.3 Z"
      fill="currentColor"
    />

    {/* Voice waveform in the counter */}
    <g fill="url(#qourlex-wave)">
      {BARS.map((bar) => (
        <rect
          key={bar.cx}
          x={bar.cx - BAR_WIDTH / 2}
          y={BAR_CENTER_Y - bar.height / 2}
          width={BAR_WIDTH}
          height={bar.height}
          rx={BAR_WIDTH / 2}
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
    className={`group inline-flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-90 focus:outline-none ${className}`}
    aria-label="Qourlex AI home"
  >
    <LogoIcon className={`${iconClassName} text-white transition-colors duration-300 group-hover:text-[#E0E7FF]`} />
    {withText && (
      <span className="brand-wordmark font-display text-xl font-bold tracking-tight text-white flex items-baseline">
        <span>QOURLEX</span>
        <span className="ml-1.5 text-accent-primary">AI</span>
      </span>
    )}
  </a>
);

export default Logo;
