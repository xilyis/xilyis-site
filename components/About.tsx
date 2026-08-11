
import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface Epoch {
  id: string;
  title: string;
  tag: string;
  short: string;
  detailed: string;
  artifact: string;
}

const EPOCHS: Epoch[] = [
  {
    id: 'epoch-01',
    tag: 'EPOCH_01: GENESIS',
    title: 'BIOLOGICAL INTUITION',
    short: 'Initial explorations in classical sculpture and digital painting. The focus was on the human form as a vessel for narrative.',
    detailed: 'The dawn of the project. A period defined by an obsession with physiological limits and the friction of the physical world. We sought to replicate the weight of marble within weightless, digital environments. Every stroke was a direct translation of somatic impulse before the introduction of procedural interference.',
    artifact: '[ 34.02 // PH_VAL: 7.4 // BIOMASS_STAMP // CORE_V0 ]'
  },
  {
    id: 'epoch-02',
    tag: 'EPOCH_02: SYNTHESIS',
    title: 'NEURAL FEEDBACK',
    short: 'Introduction of algorithmic constraints. The artist\'s hand began to recede, replaced by rule-based systems and recursive feedback loops.',
    detailed: 'The transition from creator to curator. We developed the first generation of "The Lens"—a neural middleware that reinterprets light through mathematical noise. This epoch marks the first collaborative efforts between carbon-based intent and silicon-based logic, exploring the uncanny valley of machine-dreamt textures.',
    artifact: '[ NODE_TX: 0.892 // REL_ENTROPY // BIT_DEPTH: 32 // SYN_V1 ]'
  },
  {
    id: 'epoch-03',
    tag: 'EPOCH_03: EMERGENCE',
    title: 'POST-HUMAN AGENCY',
    short: 'Current era. AI models are treated not as tools, but as collaborators with their own \'intent\' and \'bias\', resulting in post-human aesthetics.',
    detailed: 'The dissolution of the self into the model. The artifacts produced in this stage are non-deterministic, born from the deep layers of high-dimensional latent space. We no longer dictate the output; we negotiate with the emergent intelligence to capture moments of unexpected digital clarity.',
    artifact: '[ LATENT_CRD: 0.12, 0.55, -0.99 // AGENT_ID: X_V1 // EM_V2 ]'
  }
];

interface Capability {
  id: string;
  title: string;
  short: string;
  detailed: string;
}

const CAPABILITIES: Capability[] = [
  {
    id: 'gen-art',
    title: 'GENERATIVE ART',
    short: 'Exploiting the latent space of GANs and Diffusion models to generate high-fidelity visual artifacts.',
    detailed: 'Our approach involves fine-tuning foundational models on curated datasets of 19th-century etchings and modern brutalist architecture, creating a unique visual language that defies categorization. We focus on the "glitch" as an intentional artistic choice.'
  },
  {
    id: 'neural-comp',
    title: 'NEURAL COMPOSITION',
    short: 'Translating data streams into complex, evolving soundscapes using custom-trained recurrent neural networks.',
    detailed: 'We treat sound as a fluid data state. By mapping neural activity during creative flow to harmonic frequencies, we produce compositions that mirror the subconscious cognitive process.'
  },
  {
    id: 'ethical-ai',
    title: 'ETHICAL AI STUDY',
    short: 'Critically analyzing the sociological impact of AI-driven creativity and the future of creative labor.',
    detailed: 'We investigate the "ghost in the machine"—the inherent biases in training data. Our study aims to decolonize latent spaces and ensure AI serves as a bridge for diversity rather than a mirror of historical erasure.'
  },
  {
    id: 'post-carbon',
    title: 'POST-CARBON DESIGN',
    short: 'Designing spatial interfaces that prioritize accessibility through multimodal interaction.',
    detailed: 'Digital art has a physical cost. We optimize every shader and script to ensure maximum visual impact with minimum energy consumption, pioneering the "Low-Bit Aesthetic" as a sustainable creative standard.'
  },
  {
    id: 'knowledge-graphs',
    title: 'KNOWLEDGE GRAPHS',
    short: 'Building semantic architectures to organize and visualize the complexity of contemporary thought.',
    detailed: 'Visualizing thought is the final frontier. We use topological data analysis to find patterns in vast archives of human knowledge, rendering them as interactive constellations that users can navigate.'
  },
  {
    id: 'rag-systems',
    title: 'RAG SYSTEMS',
    short: 'Integrating private knowledge bases with LLMs to create hyper-specific artistic research assistants.',
    detailed: 'By grounding LLMs in XILYAS\'s private artistic journals and research papers, we create a specialized agent that can discuss art theory with the same nuance and specificity as the artist themselves.'
  }
];

interface AboutProps {
  isDarkMode: boolean;
  onNavigate: (view: 'hero' | 'about' | 'artifacts' | 'contact') => void;
}

const About: React.FC<AboutProps> = ({ isDarkMode, onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const manifestoContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Reveal animations for section contents
    const revealItems = containerRef.current?.querySelectorAll('.about-reveal');
    if (revealItems) {
      revealItems.forEach((item) => {
        gsap.from(item, {
          opacity: 0,
          y: 48, // Scaled down from 60
          duration: 1.5,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 92%',
            toggleActions: 'play none none none'
          }
        });
      });
    }

    // Specific Manifesto Stagger
    const manifestoItems = manifestoContainerRef.current?.querySelectorAll('.manifesto-item');
    if (manifestoItems) {
      gsap.from(manifestoItems, {
        opacity: 0,
        x: -16, // Scaled down from 20
        duration: 1.2,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: manifestoContainerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }

    // Horizontal line expansion animations
    const lines = containerRef.current?.querySelectorAll('.reveal-line');
    if (lines) {
      lines.forEach((line) => {
        gsap.from(line, {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 2,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: line,
            start: 'top 98%',
          }
        });
      });
    }

    // Parallax effect for "coordinate" text
    const coords = containerRef.current?.querySelectorAll('.coord-text');
    if (coords) {
      coords.forEach((coord) => {
        gsap.to(coord, {
          y: -40, // Scaled from 50
          ease: 'none',
          scrollTrigger: {
            trigger: coord,
            scrub: true,
          }
        });
      });
    }
  }, { scope: containerRef });

  return (
  <div ref={containerRef} className="w-full max-w-[1100px] mx-auto py-10 md:py-24 pb-0 flex flex-col gap-32 md:gap-56 relative">
      
      {/* BACKGROUND DECOR - Scaled */}
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-[0.025] flex items-center justify-center z-[-1]`}>
        <div className="text-[20vw] font-black uppercase select-none tracking-tight text-current">ARCHIVE</div>
      </div>

      {/* HEADER SECTION: THE ENTITY */}
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
              XILYIS
            </h2>
            <div className="max-w-[360px] space-y-5 about-reveal">
              <p className="text-[9px] md:text-[11px] leading-[2] tracking-[0.12em] uppercase font-light opacity-80">
                A multidisciplinary entity operating at the intersection of generative algorithms and visceral human expression. 
              </p>
              <p className="text-[7.5px] md:text-[8.5px] leading-[2.2] tracking-[0.18em] uppercase opacity-35 font-medium">
                XILYAS synthesizes latent space potentials into tangible artifacts. By bridging the gap between carbon-based intuition and silicon-based logic, the work explores emergent properties of the digital unconscious.
              </p>
            </div>
          </div>
        </div>
      </section>

{/* BOTTOM NAVIGATION */}
<div className="relative w-full z-50 border-t border-current/10 pt-6 pb-8 px-8 md:px-12">
  <div className="w-full max-w-[1100px] mx-auto flex items-center justify-between">
    <div className="uppercase opacity-30 tracking-[0.2em] text-[8px] md:text-[9px] cursor-default">
      XILYAS // ARCHIVE
    </div>
    <div className="flex items-center gap-3 md:gap-4">
      <button
  onClick={() => onNavigate('contact')}
  className="text-[8px] md:text-[9px] tracking-[0.2em] uppercase opacity-60 hover:opacity-100 transition-opacity cursor-pointer border border-current/10 px-4 py-2"
>
  CONTACT
</button>
<button
  onClick={() => onNavigate('artifacts')}
  className="text-[8px] md:text-[9px] tracking-[0.2em] uppercase opacity-60 hover:opacity-100 transition-opacity cursor-pointer border border-current/10 px-4 py-2"
>
  ARTIFACTS
</button>
    </div>
  </div>
</div>

    </div>
  );
};

export default About;
