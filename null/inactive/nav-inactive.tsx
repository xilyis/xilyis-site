import React, { useState, useEffect, useRef } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface NavbarProps {
  currentTime: Date;
  isDarkMode: boolean;
  onNavigate: (view: 'hero' | 'about' | 'artifacts' | 'exhibits' | 'case' | 'publications' | 'contact' | 'portfolio') => void;
  currentView: 'hero' | 'about' | 'artifacts' | 'exhibits' | 'case' | 'publications' | 'contact' | 'portfolio';
}

const Navbar: React.FC<NavbarProps> = ({ currentTime, isDarkMode, onNavigate, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useGSAP(() => {
    if (isMenuOpen) {
      gsap.fromTo(menuRef.current,
        { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
        { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 0.8, ease: 'expo.out' }
      );
      gsap.from('.mobile-nav-link', {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2
      });
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'ABOUT', view: 'about' as const },
    { name: 'ARTIFACTS', view: 'artifacts' as const },
    { name: 'EXHIBITS', view: 'exhibits' as const },
    { name: 'CASE', view: 'case' as const },
    { name: 'PUBLICATIONS', view: 'publications' as const },
    { name: 'CONTACT', view: 'contact' as const }
  ];

  const handleMobileNav = (view: any) => {
    setIsMenuOpen(false);
    onNavigate(view);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour12: false });
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full h-16 md:h-20 z-50 flex items-center justify-between px-6 md:px-10 pointer-events-none transition-all duration-500`}>
        {/* Left: Logo */}
        <div className="flex-1 flex justify-start pointer-events-auto">
          <div 
            onClick={() => onNavigate('hero')}
            className={`transition-all duration-700 opacity-40 hover:opacity-100 cursor-pointer ${isDarkMode ? 'text-white' : 'text-black'}`}
          >
            <svg className="w-3.5 h-3.5 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2L12 22M2 12L22 12" />
            </svg>
          </div>
        </div>

        {/* Center: Desktop Nav - Hidden on Scroll or Mobile */}
        <nav className={`hidden lg:flex items-center space-x-10 text-[7px] tracking-[0.35em] font-bold pointer-events-auto transition-all duration-500 ${isScrolled ? 'opacity-0 translate-y-[-20px] pointer-events-none' : 'opacity-100 translate-y-0'}`}>
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => onNavigate(link.view)}
              className={`transition-all duration-700 hover:tracking-[0.45em] border-b py-1 ${
                currentView === link.view
                  ? 'opacity-100 border-current' 
                  : 'opacity-40 border-transparent hover:border-current'
              } ${isDarkMode ? 'text-white' : 'text-black'}`}
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Right: Time + Hamburger */}
        <div className="flex-1 flex justify-end items-center gap-6 pointer-events-auto">
          <div className={`hidden md:flex items-center space-x-3 text-[7px] md:text-[8px] tracking-[0.2em] opacity-40 font-medium transition-opacity duration-500 hover:opacity-80 cursor-default ${isDarkMode ? 'text-white' : 'text-black'}`}>
            <span className="tabular-nums font-light">{formatTime(currentTime)} JST</span>
            <Globe size={10} className="md:w-[11px] md:h-[11px]" strokeWidth={1} />
          </div>

          {/* Hamburger Trigger */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className={`group flex items-center justify-center w-8 h-8 md:w-10 md:h-10 border transition-all duration-500 backdrop-blur-sm ${
              isDarkMode ? 'border-white/10 hover:border-white/30 text-white bg-black/20' : 'border-black/10 hover:border-black/30 text-black bg-white/20'
            } ${
              // Visibility Logic: Always visible on mobile (< lg). On desktop, only visible if scrolled.
              isScrolled ? 'lg:opacity-100 lg:translate-y-0 lg:pointer-events-auto' : 'lg:opacity-0 lg:translate-y-[-10px] lg:pointer-events-none'
            } opacity-100 pointer-events-auto`}
          >
             <Menu size={16} strokeWidth={1} />
          </button>
        </div>
      </header>

      {/* Full Screen Menu Overlay */}
      {isMenuOpen && (
        <div ref={menuRef} className={`fixed inset-0 z-[100] flex flex-col ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-black'}`}>
           {/* Header inside Menu */}
           <div className="h-16 md:h-20 flex items-center justify-between px-6 md:px-10 border-b border-current/10">
              <span className="text-[9px] tracking-[0.4em] font-bold uppercase opacity-40">INDEX</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity"
              >
                <X size={20} strokeWidth={1} />
              </button>
           </div>

           {/* Links Container */}
           <div className="flex-1 flex flex-col justify-center px-6 md:px-20 relative py-8">
              <div className="space-y-4 md:space-y-6 relative z-10">
                 {navLinks.map((link, idx) => (
                   <button 
                     key={link.name}
                     onClick={() => handleMobileNav(link.view)}
                     className="mobile-nav-link block text-left group w-full"
                   >
                     <div className="flex items-baseline gap-4 md:gap-8 border-b border-transparent hover:border-current/20 pb-2 transition-all">
                        <span className="text-[9px] md:text-[11px] font-mono opacity-30 group-hover:opacity-100 transition-opacity">0{idx + 1}</span>
                        <span className="text-[36px] md:text-[4.5vh] leading-[0.9] font-[100] tracking-tighter uppercase group-hover:translate-x-2 transition-all duration-500 py-1 block">
                          {link.name}
                        </span>
                     </div>
                   </button>
                 ))}
              </div>
           </div>

           {/* Footer inside Menu */}
           <div className="h-20 flex items-center justify-between px-6 md:px-10 border-t border-current/10 text-[9px] tracking-[0.2em] uppercase opacity-40">
              <span>XILYAS</span>
              <span>{formatTime(currentTime)}</span>
           </div>
        </div>
      )}
    </>
  );
};

export default Navbar;