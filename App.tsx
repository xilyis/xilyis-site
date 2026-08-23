import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Artifacts from './components/Artifacts';
import ArtifactDetail from './components/ArtifactDetail';
import ArtifactInfo from './components/ArtifactInfo';
import Contact from './components/Contact';
import Footer from './components/Footer';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

type View = 'hero' | 'about' | 'artifacts' | 'contact';
type DetailView = 'detail' | 'info' | null;

interface TabSection {
  id: string;
  label: string;
  content: string;
}

interface GalleryMediaItem {
  id: string;
  label: string;
  description: string;
  media: string[];  // Sub-media for this gallery item
  tabSections: TabSection[];
  metadata: Record<string, string>;
}

interface ArtifactEntry {
  id: string;
  label: string;
  status: string;
  timestamp: string;
  thumbnail: string;
  sourceUrl: string;
  type: 'python' | 'web' | 'other';
  galleryMedia: GalleryMediaItem[];
}

const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState<View>('hero');
  const [selectedArtifactId, setSelectedArtifactId] = useState<string>();
  const [activeDetailView, setActiveDetailView] = useState<DetailView>(null);
  const [selectedGalleryMediaIndex, setSelectedGalleryMediaIndex] = useState(0);  // NEW
  const leftLineRef = useRef<HTMLDivElement>(null);
  const rightLineRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Entries data with galleryMedia structure
  const entries: ArtifactEntry[] = [
    {
      id: '01',
      label: 'ENTRY 01',
      status: 'ACTIVE',
      timestamp: '2024.08.11',
      thumbnail: '/assets/sacred-patterns-thumb.png',
      sourceUrl: 'https://github.com/you/repo/blob/main/SacredPatterns.py',
      type: 'python',
      galleryMedia: [
        {
          id: '01-01',
          label: 'GALLERY MEDIA 01',
          description: 'First gallery item description',
          media: ['/assets/gm1-sub1.png', '/assets/gm1-sub2.png', '/assets/gm1-sub3.png'],
          tabSections: [
            { id: 'overview', label: 'OVERVIEW', content: 'Overview for gallery media 01.' },
            { id: 'process', label: 'PROCESS', content: 'Process details for gallery media 01.' },
            { id: 'tech', label: 'TECHNICAL', content: 'Technical specs for gallery media 01.' }
          ],
          metadata: {
            'Resolution': '1920x1080',
            'Format': 'PNG',
            'Size': '2.3 MB'
          }
        },
        {
          id: '01-02',
          label: 'GALLERY MEDIA 02',
          description: 'Second gallery item description',
          media: ['/assets/gm2-sub1.png', '/assets/gm2-sub2.png'],
          tabSections: [
            { id: 'overview', label: 'OVERVIEW', content: 'Overview for gallery media 02.' },
            { id: 'process', label: 'PROCESS', content: 'Process details for gallery media 02.' },
            { id: 'tech', label: 'TECHNICAL', content: 'Technical specs for gallery media 02.' }
          ],
          metadata: {
            'Resolution': '1920x1080',
            'Format': 'PNG',
            'Size': '1.8 MB'
          }
        }
      ]
    },
    {
      id: '02',
      label: 'ENTRY 02',
      status: 'VER_2',
      timestamp: '2024.03.15',
      thumbnail: '/assets/default-placeholder.png',
      sourceUrl: '#',
      type: 'python',
      galleryMedia: [
        {
          id: '02-01',
          label: 'GALLERY MEDIA 01',
          description: 'Entry 02 gallery media 01',
          media: ['/assets/entry02-gm1-1.png', '/assets/entry02-gm1-2.png'],
          tabSections: [
            { id: 'overview', label: 'OVERVIEW', content: 'Entry 02 overview.' },
            { id: 'process', label: 'PROCESS', content: 'Entry 02 process.' },
            { id: 'tech', label: 'TECHNICAL', content: 'Entry 02 technical.' }
          ],
          metadata: {
            'Status': 'Under Development',
            'Version': '2.0'
          }
        }
      ]
    }
  ];

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
        setSelectedArtifactId(undefined);
        setSelectedGalleryMediaIndex(0);  // Reset gallery index
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

  const getCurrentGalleryMediaItems = () => {
    const entry = entries.find(e => e.id === selectedArtifactId);
    return entry?.galleryMedia || [];
  };

  
const renderContent = () => {
  if (currentView === 'artifacts' && selectedArtifactId) {
    if (activeDetailView === 'info') {
      const currentGalleryItems = getCurrentGalleryMediaItems();
      return (
        <ArtifactInfo 
          isDarkMode={isDarkMode}
          galleryMediaItems={currentGalleryItems}
          currentGalleryMediaIndex={selectedGalleryMediaIndex}
          onGalleryMediaChange={(newIndex) => setSelectedGalleryMediaIndex(newIndex)}
          onBack={() => setActiveDetailView('detail')}
          onAssetClick={(index: number) => {
            console.log('Open fullscreen for sub-media index:', index);
          }}  
        />
      );
    }

    return (
      <ArtifactDetail 
        isDarkMode={isDarkMode}
        artifactId={selectedArtifactId}
        onBack={() => {
          setActiveDetailView(null);
          setSelectedArtifactId(undefined);
        }}
        onNavigateToInfo={(id) => {
          setSelectedArtifactId(id);
          setActiveDetailView('info');
          setSelectedGalleryMediaIndex(0);  // Reset to first gallery item
        }}
        onAssetClick={(index) => console.log('Open asset expanded:', index)}
      />
    );
  }

  switch (currentView) {
    case 'hero':
      return <Hero isDarkMode={isDarkMode} onNavigate={navigateTo} />;
    case 'about':
      return <About isDarkMode={isDarkMode} onNavigate={navigateTo} />;
    case 'artifacts':
      return (
        <Artifacts 
          isDarkMode={isDarkMode}
          onNavigate={navigateTo}
          onNavigateToDetail={(id) => {
            setSelectedArtifactId(id);
            setActiveDetailView('detail');
            setSelectedGalleryMediaIndex(0);
          }}
          onNavigateToInfo={(id) => {
            setSelectedArtifactId(id);
            setActiveDetailView('info');
            setSelectedGalleryMediaIndex(0);
          }}
        />
      );
    case 'contact':
      return <Contact isDarkMode={isDarkMode} />;
    default:
      const _exhaustiveCheck: never = currentView;
      return null;
  }
};

const isFixedView = ['hero'].includes(currentView);

  return (
<div className={`w-full flex flex-col ${isDarkMode ? 'text-white bg-black' : 'text-black bg-white'}`}>
      {/* Grain layer */}
      <div className="grain" />
      
      {/* Structural layout lines */}
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
        className={`relative z-20 w-full min-h-screen flex flex-col items-center px-[10px] md:px-[20px] pt-16 ${isFixedView ? 'pb-4 h-screen overflow-hidden' : 'pb-[10px]'}`}
      >
        {renderContent()}
      </main>

      <Footer isDarkMode={isDarkMode} toggleMode={toggleMode} />
    </div>
  );
};

export default App;