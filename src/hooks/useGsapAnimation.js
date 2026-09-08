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

export { gsap, ScrollTrigger };
