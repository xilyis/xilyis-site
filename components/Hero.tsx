
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface HeroProps {
  isDarkMode: boolean;
  onNavigate: (view: any) => void;
}

const Hero: React.FC<HeroProps> = ({ isDarkMode, onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleWrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const primaryBtnRef = useRef<HTMLButtonElement>(null);
  const secondaryBtnRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Reset initial states
    gsap.set(titleRef.current, { y: '100%' }); // Push text down inside wrapper
    gsap.set(titleWrapperRef.current, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' });
    gsap.set([descRef.current, buttonsRef.current, detailsRef.current], { opacity: 0, y: 20 });

    // Entrance Sequence
    tl
      // 1. Cinematic Text Rise (using masking)
      .to(titleRef.current, {
        y: '0%',
        duration: 1.8,
        ease: 'power4.out',
        delay: 0.2
      })
      // 2. Subtitle Fade
      .to(descRef.current, {
        opacity: 0.5,
        y: 0,
        duration: 1.2,
        ease: 'power3.out'
      }, '-=1.4')
      // 3. Buttons & Details Stagger
      .to([buttonsRef.current, detailsRef.current], {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out'
      }, '-=1.0');

  }, { scope: containerRef });

  const handleButtonParallax = (e: React.MouseEvent<HTMLButtonElement>, btnRef: React.RefObject<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const moveX = (x - centerX) * 0.12;
    const moveY = (y - centerY) * 0.25;

    const content = btnRef.current.querySelector('.parallax-content');
    const light = btnRef.current.querySelector('.parallax-light');

    gsap.to(content, {
      x: moveX,
      y: moveY,
      duration: 0.4,
      ease: 'power2.out'
    });

    if (light) {
      gsap.to(light, {
        x: x - 40,
        y: y - 40,
        opacity: 0.12,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  };

  const resetButtonParallax = (btnRef: React.RefObject<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const content = btnRef.current.querySelector('.parallax-content');
    const light = btnRef.current.querySelector('.parallax-light');

    gsap.to(content, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)'
    });

    if (light) {
      gsap.to(light, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      });
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center text-center max-w-6xl mx-auto py-4 md:py-6 relative z-20">
      
      {/* Main Branding - Mask Wrapper for Clip Reveal */}
      <div ref={titleWrapperRef} className="overflow-hidden mb-4 md:mb-6 pb-2 px-4">
        <h1 
          ref={titleRef}
          className="text-[14vw] sm:text-[10vw] md:text-[6.5rem] lg:text-[7.5rem] uppercase font-[100] tracking-[0.25em] md:tracking-[0.3em] leading-[0.95] select-none translate-y-full"
        >
          XILYIS
        </h1>
      </div>

      {/* Description - Reduced size */}
      <p 
        ref={descRef}
        className="max-w-md md:max-w-lg text-[8px] md:text-[9.5px] leading-[2] md:leading-[2.2] tracking-[0.3em] md:tracking-[0.35em] uppercase font-[300] mb-8 md:mb-10 px-4"
      >
        A digital archive of generative and traditional artifacts. 
      </p>

      {/* CTA Buttons - Compact */}
      <div 
        ref={buttonsRef}
        className="flex flex-col sm:flex-row items-center justify-center gap-5 md:gap-8 mb-12 md:mb-16 w-full max-w-xs sm:max-w-none px-4"
      >
        <button 
          ref={primaryBtnRef}
          onClick={() => onNavigate('artifacts')}
          onMouseMove={(e) => handleButtonParallax(e, primaryBtnRef)}
          onMouseLeave={() => resetButtonParallax(primaryBtnRef)}
          className={`group relative w-full sm:w-auto px-8 md:px-11 py-3.5 md:py-4 text-[8px] font-bold tracking-[0.35em] md:tracking-[0.4em] uppercase transition-colors duration-500 overflow-hidden ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}
        >
          <div className="parallax-content relative z-10 block">
            Archive
          </div>
          <div className={`parallax-light absolute w-28 h-28 blur-2xl rounded-full pointer-events-none opacity-0 ${isDarkMode ? 'bg-black' : 'bg-white'}`} style={{ top: 0, left: 0 }} />
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${isDarkMode ? 'bg-black' : 'bg-white'}`} />
        </button>

        <button 
          ref={secondaryBtnRef}
          onClick={() => onNavigate('about')}
          onMouseMove={(e) => handleButtonParallax(e, secondaryBtnRef)}
          onMouseLeave={() => resetButtonParallax(secondaryBtnRef)}
          className={`group relative w-full sm:w-auto px-8 md:px-11 py-3.5 md:py-4 text-[8px] font-bold tracking-[0.35em] md:tracking-[0.4em] uppercase border transition-all duration-500 overflow-hidden ${isDarkMode ? 'border-zinc-800 text-white hover:border-white' : 'border-zinc-200 text-black hover:border-black'}`}
        >
          <div className="parallax-content relative z-10 block group-hover:tracking-[0.5em]">
            About
          </div>
          <div className={`parallax-light absolute w-28 h-28 blur-3xl rounded-full pointer-events-none opacity-0 ${isDarkMode ? 'bg-white' : 'bg-black'}`} style={{ top: 0, left: 0 }} />
        </button>
      </div>

      {/* Micro-details */}
      <div 
        ref={detailsRef}
        className="flex flex-col md:flex-row justify-center items-center gap-y-4 md:gap-x-12 text-[7px] tracking-[0.35em] md:tracking-[0.4em] uppercase font-bold mt-[10px] opacity-30"
      >
        <div className="flex items-center gap-3 group cursor-default">
          <div className="hidden md:block w-8 h-px bg-current opacity-20 group-hover:w-12 group-hover:opacity-100 transition-all duration-700"></div>
          <span className="opacity-50 group-hover:opacity-100 transition-opacity duration-500">Link_01</span>
        </div>
        <div className="flex items-center gap-3 group cursor-default">
          <div className="hidden md:block w-8 h-px bg-current opacity-20 group-hover:w-12 group-hover:opacity-100 transition-all duration-700"></div>
          <span className="opacity-50 group-hover:opacity-100 transition-opacity duration-500">Link_02</span>
        </div>
        <div className="flex items-center gap-3 group cursor-default">
          <div className="hidden md:block w-8 h-px bg-current opacity-20 group-hover:w-12 group-hover:opacity-100 transition-all duration-700"></div>
          <span className="opacity-50 group-hover:opacity-100 transition-opacity duration-500">Link_03</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
