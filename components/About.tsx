import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import PageFooter from './PageFooter';
import { MOTION, prefersReducedMotion } from '../motion';
import { SITE_NAME } from '../siteConfig';
gsap.registerPlugin(ScrollTrigger);

interface Capability {
  id: string;
  title: string;
  short: string;
  detailed: string;
}

interface AboutProps {
  isDarkMode: boolean;
  onNavigate: (view: 'hero' | 'about' | 'artifacts' | 'studies' | 'contact' | 'writings') => void;
}

const About: React.FC<AboutProps> = ({ isDarkMode, onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const manifestoContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    // Reveal animations for section contents
    containerRef.current?.querySelectorAll('.about-reveal').forEach((item) => {
      gsap.from(item, {
        opacity: 0,
        y: MOTION.scrollOffset,
        duration: MOTION.scroll,
        ease: MOTION.ease,
        clearProps: 'opacity,transform',
        scrollTrigger: {
          trigger: item,
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
      });
    });

    // Horizontal line expansion animations
    containerRef.current?.querySelectorAll('.reveal-line').forEach((line) => {
      gsap.from(line, {
        scaleX: 0,
        transformOrigin: 'left',
        duration: MOTION.line,
        ease: MOTION.ease,
        clearProps: 'transform',
        scrollTrigger: {
          trigger: line,
          start: 'top 98%',
        },
      });
    });

    // Subtle parallax on the coordinate labels
    containerRef.current?.querySelectorAll('.coord-text').forEach((coord) => {
      gsap.to(coord, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: coord,
          scrub: true,
        },
      });
    });
  }, { scope: containerRef });

  return (
  <div ref={containerRef} className="w-full max-w-[1100px] mx-auto py-10 md:py-24 pb-0 flex flex-col gap-20 md:gap-32 relative">

      {/* HEADER SECTION*/}
      <section className="relative w-full px-4 md:px-0">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div className="coord-text text-[6.5px] md:text-[7.5px] tracking-[0.4em] opacity-30 uppercase font-bold mb-3 md:mb-0">
            LOC_00.1 // THE_ARTIST
          </div>
          <div className="reveal-line h-px w-full md:w-2/3 bg-current opacity-15" />
        </div>
        
        <div className="flex flex-col md:flex-row gap-10 md:gap-20 items-start">
          <div className="flex-1">
            <h2 className="about-reveal text-[14vw] sm:text-[10vw] md:text-[6.5rem] lg:text-[7.5rem] uppercase font-[100] tracking-[0.25em] md:tracking-[0.3em] leading-[0.95] mb-10 select-none">
              {SITE_NAME}
            </h2>
            <div className="max-w-[360px] space-y-5 about-reveal">
              <p className="text-[9px] md:text-[11px] leading-[2] tracking-[0.12em] uppercase font-light opacity-80">
                A multidisciplinary entity operating at the intersection of generative algorithms and visceral human expression. 
              </p>
              <p className="text-[7.5px] md:text-[8.5px] leading-[2.2] tracking-[0.18em] uppercase opacity-35 font-medium">
                {SITE_NAME} synthesizes latent space potentials into tangible artifacts. By bridging the gap between carbon-based intuition and silicon-based logic, the work explores emergent properties of the digital unconscious.
              </p>
            </div>
          </div>
        </div>
      </section>

{/* PAGE FOOTER - 4 COLUMN LAYOUT */}
      <section>
        <div className="mt-24">
          <PageFooter 
          isDarkMode={isDarkMode} 
          onNavigate={onNavigate}
          />
        </div>
      </section>

    </div>
  );
};

export default About;