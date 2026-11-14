import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MOTION, prefersReducedMotion } from '../motion';

interface LoaderProps {
  /** Called as the overlay starts fading, so the page can mount and animate in underneath. */
  onReveal: () => void;
  /** Called when the overlay has fully faded out and can be removed. */
  onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onReveal, onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Reduced motion: skip the sequence entirely
    if (prefersReducedMotion()) {
      onReveal();
      onComplete();
      return;
    }

    const tl = gsap.timeline({ onComplete });

    tl
      // 1. Initial burst
      .to(barRef.current, { width: '60%', duration: 0.5, ease: 'power4.out' })
      // 2. Short stall, like heavy assets loading
      .to(barRef.current, { width: '85%', duration: 0.5, ease: 'linear' })
      // 3. Final snap
      .to(barRef.current, { width: '100%', duration: 0.3, ease: 'power2.inOut' })
      // 4. Collapse the bar
      .to(barRef.current, { height: 0, opacity: 0, duration: 0.2, ease: 'power2.out' })
      // 5. Mount the page, then fade the black overlay away over it
      .call(onReveal)
      .to(containerRef.current, { opacity: 0, duration: 0.6, ease: MOTION.ease });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black pointer-events-auto"
    >
      <div className="relative w-64 md:w-80">
        {/* Track */}
        <div className="h-[1px] w-full overflow-hidden bg-zinc-900">
          {/* Progress bar */}
          <div
            ref={barRef}
            className="h-full w-0 bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;