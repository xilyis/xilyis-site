import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Artifacts from './components/Artifacts';
import Contact from './components/Contact';
import Footer from './components/Footer';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

type View = 'hero' | 'about' | 'artifacts' | 'contact';

const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState<View>('hero');
  
  const leftLineRef = useRef<HTMLDivElement>(null);
  const rightLineRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Clock timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Throttled mousemove handler using useCallback
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!leftLineRef.current || !rightLineRef.current) return;
    
    const { clientX } = e;
    const xPos = (clientX / window.innerWidth - 0.5) * 20;

    gsap.to(leftLineRef.current, { x: xPos * 0.5, duration: 1.5, ease: 'power2.out' });
    gsap.to(rightLineRef.current, { x: xPos * 0.5, duration: 1.5, ease: 'power2.out' });
  }, []);

  useGSAP(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const navigateTo = (view: View) => {
    if (view === currentView || !mainContentRef.current) return;

    gsap.to(mainContentRef.current, {
      opacity: 0,
      y: 10,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        setCurrentView(view);
        window.scrollTo(0, 0);
        
        if (mainContentRef.current) {
          gsap.to(mainContentRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
          });
        }
      }
    });
  };

  const toggleMode = () => setIsDarkMode(!isDarkMode);

  // Properly implemented render function for all views
  const renderContent = (): JSX.Element | null => {
    switch (currentView) {
      case 'hero':
        return <Hero isDarkMode={isDarkMode} onNavigate={navigateTo} />;
      case 'about':
        return <About isDarkMode={isDarkMode} onNavigate={navigateTo} />;
      case 'artifacts':
        return <Artifacts isDarkMode={isDarkMode} />;
      case 'contact':
        return <Contact isDarkMode={isDarkMode} />;
      default:
        // Exhaustive check - this will error if View type changes
        const _exhaustiveCheck: never = currentView;
        return null;
    }
  };

  const isFixedView = ['hero'].includes(currentView);

  return (
    <div className={`relative min-h-screen w-full transition-colors duration-1000 font-['Inter'] selection:bg-zinc-500/30 overflow-x-hidden ${isDarkMode ? 'bg-black text-white' : 'bg-zinc-50 text-black'}`}>
      {/* Grain layer */}
      <div className="grain" />
      
      {/* Structural layout lines - now safe if refs are null */}
      <div 
        ref={leftLineRef}
        className={`fixed top-0 bottom-0 left-4 md:left-[5%] w-px transition-colors duration-1000 z-10 ${isDarkMode ? 'bg-zinc-900/50' : 'bg-zinc-200'}`} 
      />
      <div 
        ref={rightLineRef}
        className={`fixed top-0 bottom-0 right-4 md:right-[5%] w-px transition-colors duration-1000 z-10 ${isDarkMode ? 'bg-zinc-900/50' : 'bg-zinc-200'}`} 
      />
      
      <Navbar 
        currentTime={currentTime} 
        isDarkMode={isDarkMode} 
        onNavigate={navigateTo} 
        currentView={currentView}
      />
      
      <main 
        ref={mainContentRef}
        className={`relative z-20 w-full min-h-screen flex flex-col items-center px-8 md:px-[10%] pt-16 ${isFixedView ? 'pb-16 h-screen overflow-hidden' : 'pb-24'}`}
      >
        {renderContent()}
      </main>

      <Footer isDarkMode={isDarkMode} toggleMode={toggleMode} />
    </div>
  );
};

export default App;