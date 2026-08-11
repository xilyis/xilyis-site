
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
}

const About: React.FC<AboutProps> = ({ isDarkMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const manifestoContainerRef = useRef<HTMLDivElement>(null);
  const [activeEpoch, setActiveEpoch] = useState<string | null>(null);
  const [activeCapability, setActiveCapability] = useState<string | null>(null);

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

  // Handle accordion animations for Epochs
  const toggleEpoch = (id: string) => {
    const isOpening = activeEpoch !== id;
    const currentActive = activeEpoch;

    setActiveEpoch(isOpening ? id : null);

    if (isOpening) {
      gsap.to(`.epoch-details-${id}`, {
        height: 'auto',
        opacity: 1,
        duration: 0.8,
        ease: 'power3.inOut'
      });
      if (currentActive) {
        gsap.to(`.epoch-details-${currentActive}`, {
          height: 0,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.inOut'
        });
      }
    } else {
      gsap.to(`.epoch-details-${id}`, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.inOut'
      });
    }
  };

  // Handle accordion animations for Capabilities
  const toggleCapability = (id: string) => {
    const isOpening = activeCapability !== id;
    const currentActive = activeCapability;

    setActiveCapability(isOpening ? id : null);

    if (isOpening) {
      gsap.to(`.cap-details-${id}`, {
        height: 'auto',
        opacity: 1,
        duration: 0.6,
        ease: 'power2.inOut'
      });
      if (currentActive) {
        gsap.to(`.cap-details-${currentActive}`, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut'
        });
      }
    } else {
      gsap.to(`.cap-details-${id}`, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut'
      });
    }
  };

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


      {/* SECTION 2: THE NARRATIVE ARC */}
      <section className="relative w-full px-4 md:px-0 flex flex-col items-end">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 w-full">
          <div className="reveal-line h-px w-full md:w-1/2 bg-current opacity-15" />
          <div className="coord-text text-[6.5px] md:text-[7.5px] tracking-[0.4em] opacity-30 uppercase font-bold mt-10 md:mt-0">
            LOC_00.2 // TIMELINE
          </div>
        </div>

        <div className="max-w-2xl about-reveal text-right w-full">
          <h3 className="text-[7vw] md:text-[4rem] leading-none tracking-tighter uppercase font-[200] mb-8">
            NARRATIVE ARC
          </h3>
          <div className="space-y-3 md:space-y-5">
            {EPOCHS.map((epoch) => (
              <div 
                key={epoch.id}
                onClick={() => toggleEpoch(epoch.id)}
                className={`group cursor-pointer border-r-2 py-6 pr-6 transition-all duration-700 ${activeEpoch === epoch.id ? 'border-current opacity-100 bg-current/[0.015]' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <div className="flex items-center justify-end gap-5 mb-2.5">
                  <span className={`text-[6.5px] md:text-[7px] tracking-[0.35em] font-bold transition-all duration-500 ${activeEpoch === epoch.id ? 'opacity-100' : 'opacity-25'}`}>{epoch.tag}</span>
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${activeEpoch === epoch.id ? 'bg-current scale-125' : 'bg-current/15'}`} />
                </div>
                
                <h4 className={`text-[10px] md:text-[11.5px] tracking-[0.25em] font-bold uppercase mb-3.5 transition-all duration-500 ${activeEpoch === epoch.id ? 'tracking-[0.35em]' : ''}`}>
                  {epoch.title}
                </h4>

                <p className="text-[9px] md:text-[10.5px] leading-relaxed tracking-[0.12em] uppercase font-light max-w-lg ml-auto">
                  {epoch.short}
                </p>

                <div className={`epoch-details-${epoch.id} h-0 opacity-0 overflow-hidden text-right`}>
                  <div className="pt-6 pb-3 space-y-10">
                    <p className="text-[8px] md:text-[9.5px] leading-[2.1] tracking-[0.15em] uppercase font-light opacity-75 border-t border-current/10 pt-6 italic">
                      {epoch.detailed}
                    </p>

                    <div className="space-y-5">
                      <div className="flex items-center justify-end gap-3">
                        <div className="h-px flex-1 bg-current opacity-10" />
                        <span className="text-[6px] md:text-[6.5px] tracking-[0.4em] opacity-25 font-mono uppercase">RELATED_ARTIFACT_PREVIEWS</span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                        {[1, 2, 3, 4].map((i) => (
                          <div 
                            key={i}
                            className="aspect-square border border-current/10 bg-current/[0.02] flex items-center justify-center relative group/art cursor-crosshair transition-all duration-500 hover:border-current/40 hover:bg-current/[0.05]"
                          >
                            <span className="text-[6.5px] md:text-[7px] tracking-[0.15em] opacity-15 group-hover/art:opacity-60 transition-opacity font-mono">
                              [ AR_{String(i).padStart(2, '0')} ]
                            </span>
                            <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-current/0 group-hover/art:border-current/40 transition-all duration-500" />
                            <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-current/0 group-hover/art:border-current/40 transition-all duration-500" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2.5">
                      <span className="text-[6px] md:text-[6.5px] tracking-[0.4em] opacity-25 font-mono uppercase">SYSTEM_EPOCH_METADATA</span>
                      <div className="bg-current/5 border border-current/10 p-3.5 text-[7.5px] md:text-[8px] font-mono tracking-widest opacity-50 hover:opacity-100 transition-opacity">
                        {epoch.artifact}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: THE DIRECTIVE */}
      <section className="relative w-full px-4 md:px-0">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
                    <div className="reveal-line h-px w-full md:w-3/4 bg-current opacity-15" />
                    <div className="coord-text text-[6.5px] md:text-[7.5px] tracking-[0.4em] opacity-30 uppercase font-bold mt-6 md:mb-0">
            LOC_00.3 // PHILOSOPHY
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 about-reveal">
            <h2 className="text-[10vw] md:text-[5rem] lg:text-[6rem] leading-[0.9] tracking-tighter uppercase font-[100]">
              Directive<br/>
            </h2>
          </div>
          <div 
            ref={manifestoContainerRef}
            className="flex-1 bg-current/[0.03] p-6 md:p-10 border border-current/10 backdrop-blur-sm"
          >
            <div className="space-y-6 text-[8.5px] md:text-[10px] leading-[2] md:leading-[2.2] tracking-[0.18em] uppercase">
              {[
                "The machine does not dream, but it remembers everything we have ever felt.",
                "Code is the new marble; weights and biases are the new chisel.",
                "Authenticity is found in the friction between the human error and the model's perfection.",
                "We are curators of the infinite."
              ].map((point, idx) => (
                <div key={idx} className="manifesto-item flex gap-5 group hover:translate-x-1.5 transition-transform duration-500">
                  <span className="opacity-25 font-bold group-hover:opacity-100 transition-opacity">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="opacity-60 group-hover:opacity-100 transition-opacity">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE CORE STACK */}
      <section className="relative w-full px-4 md:px-0">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="reveal-line h-px w-full md:w-2/3 bg-current opacity-15" />
          <div className="coord-text text-[6.5px] md:text-[7.5px] tracking-[0.4em] opacity-30 uppercase font-bold mt-3 md:mt-0">
            LOC_00.4 // CAPABILITIES
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-10 about-reveal">
          {CAPABILITIES.map((cap) => (
            <div 
              key={cap.id} 
              onClick={() => toggleCapability(cap.id)}
              className={`space-y-3.5 group cursor-pointer transition-all duration-500 ${activeCapability === cap.id ? 'bg-current/[0.025] -mx-3 px-3 py-5 border-l border-current/15' : ''}`}
            >
              <div className="flex items-center justify-between">
                <h4 className={`text-[9px] md:text-[10px] tracking-[0.35em] font-bold transition-all duration-500 ${activeCapability === cap.id ? 'opacity-100' : 'opacity-35 group-hover:opacity-100'}`}>
                  {cap.title}
                </h4>
                <div className={`text-[8.5px] md:text-[9px] opacity-15 transition-transform duration-500 ${activeCapability === cap.id ? 'rotate-45 opacity-100' : ''}`}>+</div>
              </div>
              
              <div className={`h-px transition-all duration-700 ${activeCapability === cap.id ? 'w-full bg-current opacity-35' : 'w-10 bg-current opacity-15 group-hover:w-full'}`} />
              
              <p className="text-[7.5px] md:text-[8px] leading-loose tracking-widest opacity-50 font-light uppercase">
                {cap.short}
              </p>
              
              <div className={`cap-details-${cap.id} h-0 opacity-0 overflow-hidden`}>
                <div className="pt-3 pb-1 border-t border-current/5 mt-3">
                  <span className="text-[6px] md:text-[6.5px] tracking-[0.4em] opacity-25 font-mono mb-2.5 block uppercase">DETAILED_APPROACH_LOG</span>
                  <p className="text-[8.5px] md:text-[9.5px] leading-relaxed tracking-wider opacity-75 italic font-light uppercase">
                    {cap.detailed}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

{/* FOOTER SECTION - Traditional 4 Column Layout */}
<footer className="relative w-full z-50 bg-background/90 backdrop-blur-sm border-t border-current/10 pt-8 pb-6 px-8 md:px-12">
  <div className="w-full max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md-gap-6">
    
    {/* Column 1: Branding */}
    <div className="space-y-3">
      <div className="uppercase opacity-100 font-bold tracking-[0.25em] text-[9px] md:text-[10px] cursor-default">
        XILYAS
      </div>
      <p className="text-[8px] md:text-[9px] opacity-60 tracking-[0.1em] uppercase leading-relaxed">
        Multidisciplinary entity exploring the intersection of generative algorithms and human expression.
      </p>
    </div>

    {/* Column 2: Navigation */}
    <div className="space-y-3">
      <div className="uppercase opacity-100 font-bold tracking-[0.2em] text-[9px] md:text-[10px] cursor-default">
        NAVIGATE
      </div>
      <div className="space-y-2">
        <a href="/" className="block text-[8px] md:text-[9px] opacity-60 tracking-[0.1em] uppercase hover:opacity-100 transition-opacity cursor-pointer">
          HOME
        </a>
        <a href="/work" className="block text-[8px] md:text-[9px] opacity-60 tracking-[0.1em] uppercase hover:opacity-100 transition-opacity cursor-pointer">
          WORK
        </a>
        <a href="/about" className="block text-[8px] md:text-[9px] opacity-60 tracking-[0.1em] uppercase hover:opacity-100 transition-opacity cursor-pointer">
          ABOUT
        </a>
      </div>
    </div>

    {/* Column 3: Contact */}
    <div className="space-y-3">
      <div className="uppercase opacity-100 font-bold tracking-[0.2em] text-[9px] md:text-[10px] cursor-default">
        CONNECT
      </div>
      <div className="space-y-2">
        <a href="/contact" className="block text-[8px] md:text-[9px] opacity-60 tracking-[0.1em] uppercase hover:opacity-100 transition-opacity cursor-pointer">
          CONTACT
        </a>
        <a href="mailto:hello@xilyas.sys" className="block text-[8px] md:text-[9px] opacity-60 tracking-[0.1em] uppercase hover:opacity-100 transition-opacity cursor-pointer">
          EMAIL
        </a>
        <a href="#" className="block text-[8px] md:text-[9px] opacity-60 tracking-[0.1em] uppercase hover:opacity-100 transition-opacity cursor-pointer">
          NEWSLETTER
        </a>
      </div>
    </div>

    {/* Column 4: Social & Info */}
    <div className="space-y-3">
      <div className="uppercase opacity-100 font-bold tracking-[0.2em] text-[9px] md:text-[10px] cursor-default">
        FOLLOW
      </div>
      <div className="space-y-2">
        <a href="https://instagram.com/xilyas" className="block text-[8px] md:text-[9px] opacity-60 tracking-[0.1em] uppercase hover:opacity-100 transition-opacity cursor-pointer">
          INSTAGRAM
        </a>
        <a href="https://twitter.com/xilyas" className="block text-[8px] md:text-[9px] opacity-60 tracking-[0.1em] uppercase hover:opacity-100 transition-opacity cursor-pointer">
          TWITTER
        </a>
        <a href="https://linkedin.com/company/xilyas" className="block text-[8px] md:text-[9px] opacity-60 tracking-[0.1em] uppercase hover:opacity-100 transition-opacity cursor-pointer">
          LINKEDIN
        </a>
      </div>
    </div>

  </div>

  {/* Bottom Bar with Copyright and Time */}
  <div className="w-full max-w-[1100px] mx-auto mt-8 pt-4 border-t border-current/10 flex justify-between items-center">
    <span className="text-[7px] md:text-[8px] opacity-40 tracking-[0.15em] uppercase">
      © {new Date().getFullYear()} XILYAS. ALL RIGHTS RESERVED
    </span>
    <span className="text-[7px] md:text-[8px] opacity-40 font-mono tracking-[0.1em]">
      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  </div>
</footer>

    </div>
  );
};

export default About;
