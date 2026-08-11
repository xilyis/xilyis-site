
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface LoaderProps {
  onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: onComplete
    });

    // Dynamic Loading Sequence
    tl
      // 1. Initial burst (0% -> 60% in 0.6s)
      .to(barRef.current, {
        width: '60%',
        duration: 0.6,
        ease: 'power4.out'
      })
      // 2. Processing stall (60% -> 85% in 1.2s) - simulates heavy asset load
      .to(barRef.current, {
        width: '85%',
        duration: 1.2,
        ease: 'linear'
      })
      // 3. Final snap (85% -> 100% in 0.4s)
      .to(barRef.current, {
        width: '100%',
        duration: 0.4,
        ease: 'power2.inOut'
      })
      // 4. Collapse bar
      .to(barRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
      // 5. Reveal Content (Fade out black overlay)
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut'
      });

  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center pointer-events-auto"
    >
      <div className="w-64 md:w-80 relative">
        {/* Track */}
        <div className="w-full h-[1px] bg-zinc-900 overflow-hidden">
          {/* Progress Bar */}
          <div 
            ref={barRef} 
            className="h-full bg-white w-0 shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;
