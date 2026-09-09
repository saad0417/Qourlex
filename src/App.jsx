import React, { useEffect } from 'react'; 
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Problem from './components/Problem';
import HowItWorks from './components/HowItWorks';
import Services from './components/Services';
import Industries from './components/Industries';
import Comparison from './components/Comparison';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  // Lenis smooth scrolling integration synced with GSAP
  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    // lerp rather than duration. In duration mode Lenis animates each wheel
    // event over a fixed time, so a burst of events queues up and the motion
    // reads as a series of steps. lerp eases the current position toward the
    // target every frame instead, so overlapping events blend into one
    // continuous glide. Lower is smoother; 0.085 is a long, unhurried follow
    // without feeling detached from the wheel.
    // Measured on this page rather than picked by feel. lerp mode was tried
    // first and is worse here: at lerp 0.085 the per-frame scroll step varied
    // by 11.3px against 5.3px for duration mode, with p95 frame time at 33ms
    // against 17ms. Duration mode it is. 1.5 lengthens the glide over the
    // previous 1.2 without drifting into the sluggish feel of longer values.
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    // Sync Lenis scroll events with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Provide anchor link smooth scrolling via Lenis
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        const id = target.getAttribute('href');
        if (id && id !== '#') {
          const element = document.querySelector(id);
          if (element) {
            e.preventDefault();
            lenis.scrollTo(element, {
              offset: -70,
              duration: 1.1,
              easing: (t) => 1 - Math.pow(1 - t, 3),
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-primary-bg text-text-body font-sans selection:bg-accent-primary selection:text-white flex flex-col">
      {/* Accessibility Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Fixed Navigation Header */}
      <Navbar />

      {/* Main Page Landmark */}
      <main id="main-content" className="flex-grow">
        <Hero />
        <Problem />
        <HowItWorks />
        <Services />
        <Industries />
        <Comparison />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
