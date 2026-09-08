import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * AnimatedCounter component that animates numbers on scroll using GSAP
 *
 * @param {number} end - Target number to count up to
 * @param {number} [start=0] - Starting number
 * @param {string} [prefix=''] - Prefix like '$'
 * @param {string} [suffix=''] - Suffix like '%' or '+'
 * @param {number} [duration=2] - Animation duration in seconds
 * @param {string} [className=''] - Extra classes
 */
export const AnimatedCounter = ({
  end,
  start = 0,
  prefix = '',
  suffix = '',
  duration = 2,
  className = '',
}) => {
  const numRef = useRef(null);

  useEffect(() => {
    const el = numRef.current;
    if (!el) return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReducedMotion) {
      el.textContent = `${prefix}${end.toLocaleString()}${suffix}`;
      return;
    }

    const obj = { val: start };

    const anim = gsap.to(obj, {
      val: end,
      duration: duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      onUpdate: () => {
        const rounded = Math.floor(obj.val);
        el.textContent = `${prefix}${rounded.toLocaleString()}${suffix}`;
      },
    });

    return () => {
      anim.kill();
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
    };
  }, [end, start, prefix, suffix, duration]);

  return (
    <span
      ref={numRef}
      className={`font-extrabold tabular-nums tracking-tight ${className}`}
      aria-label={`${prefix}${end}${suffix}`}
    >
      {prefix}{start.toLocaleString()}{suffix}
    </span>
  );
};

export default AnimatedCounter;
