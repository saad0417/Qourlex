import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Custom hook to execute GSAP animations with automatic context cleanup
 * and respect for prefers-reduced-motion.
 *
 * @param {Function} animationCallback - Function receiving (self, isReducedMotion)
 * @param {Array} dependencies - React dependencies array
 * @param {React.RefObject} [targetRef] - Optional container ref
 * @returns {React.RefObject} - Scope ref
 */
export const useGsapAnimation = (animationCallback, dependencies = [], targetRef) => {
  const internalRef = useRef(null);
  const scopeRef = targetRef || internalRef;

  useEffect(() => {
    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // In GSAP, scope must be a DOM Element or undefined (not the React Ref object itself)
    const scopeElement = scopeRef?.current || undefined;

    const ctx = gsap.context((self) => {
      animationCallback(self, isReducedMotion);
    }, scopeElement);

    return () => {
      ctx.revert();
    };
  }, dependencies);

  return scopeRef;
};

/**
 * Picks the offset a reveal should start from.
 *
 * Sliding a column in from the side only makes sense once the columns actually
 * sit side by side. Once they stack, the element is full width, so a positive x
 * offset parks it past the right edge of the viewport until its ScrollTrigger
 * fires — which shows up as content being clipped on phones. Below the
 * breakpoint the reveal comes from below instead.
 *
 * @param {number} dx  horizontal offset to use in the side-by-side layout
 * @param {number} breakpoint  px width at which that layout kicks in
 */
export const revealOffset = (dx, breakpoint = 768) => {
  const sideBySide =
    typeof window !== 'undefined' &&
    window.matchMedia(`(min-width: ${breakpoint}px)`).matches;
  return sideBySide ? { x: dx, y: 0 } : { x: 0, y: 32 };
};

export { gsap, ScrollTrigger };
