import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Artifacts from './components/Artifacts';
import ArtifactDetail from './components/ArtifactDetail';
import ArtifactInfo from './components/ArtifactInfo';
import Studies from './components/Studies';
import Writings from './components/Writings';
import WritingArticle from './components/WritingArticle';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Loader from './components/Loader';
import { FEATURES, isViewEnabled } from './featureFlags';
import { getArtifactById } from './artifactData';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// The site can be hosted under a sub-path (vite.config.ts `base`, e.g. '/xilyis-site/'),
// so URLs the app writes or reads include it. Empty string when hosted at the root.
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');

type View =
  | 'hero'
  | 'about'
  | 'artifacts'
  | 'studies'
  | 'contact'
  | 'writings'
  | 'writingArticle';

type DetailView = 'detail' | 'info' | null;

const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(true);
  // Loader: `isLoaded` mounts the page, `showLoader` removes the overlay afterwards
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [currentView, setCurrentView] = useState<View>('hero');

  const [selectedArtifactId, setSelectedArtifactId] = useState<
    string | undefined
  >(undefined);

  const [activeDetailView, setActiveDetailView] =
    useState<DetailView>(null);

  const [selectedGalleryMediaIndex, setSelectedGalleryMediaIndex] =
    useState(0);

  const [selectedWritingSlug, setSelectedWritingSlug] =
    useState<string | null>(null);

  const leftLineRef = useRef<HTMLDivElement>(null);
  const rightLineRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const resolveWritingRoute = () => {
      // Path relative to the base, e.g. '/xilyis-site/writing' -> '/writing'
      const fullPath = window.location.pathname;
      const pathname = fullPath.startsWith(BASE_PATH)
        ? fullPath.slice(BASE_PATH.length) || '/'
        : fullPath;

      // Writings is hidden: send direct /writing URLs back to the home page.
      if (!FEATURES.writings) {
        if (pathname.startsWith('/writing')) {
          window.history.replaceState({}, '', `${BASE_PATH}/`);
        }
        return;
      }

      const articleMatch = pathname.match(/^\/writing\/([^/]+)$/);

      if (articleMatch) {
        setSelectedWritingSlug(articleMatch[1]);
        setCurrentView('writingArticle');
        return;
      }

      if (pathname === '/writing') {
        setSelectedWritingSlug(null);
        setCurrentView('writings');
      }
    };

    resolveWritingRoute();

    window.addEventListener('popstate', resolveWritingRoute);

    return () => {
      window.removeEventListener('popstate', resolveWritingRoute);
    };
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!leftLineRef.current || !rightLineRef.current) return;

    const xPosition =
      (event.clientX / window.innerWidth - 0.5) * 20;

    gsap.to(leftLineRef.current, {
      x: xPosition * 0.5,
      duration: 1.5,
      ease: 'power2.out',
    });

    gsap.to(rightLineRef.current, {
      x: xPosition * 0.5,
      duration: 1.5,
      ease: 'power2.out',
    });
  }, []);

  useGSAP(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  const openWritingIndex = () => {
    setSelectedWritingSlug(null);
    setCurrentView('writings');
    window.history.pushState({}, '', `${BASE_PATH}/writing`);
    window.scrollTo(0, 0);
  };

  const openWritingArticle = (slug: string) => {
    setSelectedWritingSlug(slug);
    setCurrentView('writingArticle');
    window.history.pushState({}, '', `${BASE_PATH}/writing/${slug}`);
    window.scrollTo(0, 0);
  };

  const navigateTo = (view: View) => {
    // Safety net: sections turned off in featureFlags.ts cannot be navigated to.
    if (!isViewEnabled(view)) {
      return;
    }

    if (view === 'writings') {
      openWritingIndex();
      return;
    }

    if (view === 'writingArticle') {
      return;
    }

    if (view === currentView || !mainContentRef.current) {
      return;
    }

    gsap.to(mainContentRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        setCurrentView(view);
        setSelectedArtifactId(undefined);
        setSelectedWritingSlug(null);
        setActiveDetailView(null);
        setSelectedGalleryMediaIndex(0);

        window.scrollTo(0, 0);

        if (mainContentRef.current) {
          gsap.to(mainContentRef.current, {
            opacity: 1,
            duration: 0.35,
            ease: 'power2.out',
          });
        }
      },
    });
  };

  const toggleMode = () => {
    setIsDarkMode((previousMode) => !previousMode);
  };

  const getCurrentGalleryMediaItems = () => {
    return getArtifactById(selectedArtifactId)?.galleryMedia ?? [];
  };

  const renderContent = () => {
    if (currentView === 'artifacts' && selectedArtifactId) {
      if (activeDetailView === 'info') {
        return (
          <ArtifactInfo
            isDarkMode={isDarkMode}
            galleryMediaItems={getCurrentGalleryMediaItems()}
            currentGalleryMediaIndex={selectedGalleryMediaIndex}
            onGalleryMediaChange={setSelectedGalleryMediaIndex}
            onBack={() => setActiveDetailView('detail')}
            onAssetClick={(index: number) => {
              console.log(
                'Open fullscreen for sub-media index:',
                index
              );
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
            setSelectedGalleryMediaIndex(0);
          }}
          onAssetClick={(index: number) => {
            console.log('Open asset expanded:', index);
          }}
        />
      );
    }

    switch (currentView) {
      case 'hero':
        return (
          <Hero
            isDarkMode={isDarkMode}
            onNavigate={navigateTo}
          />
        );

      case 'about':
        return (
          <About
            isDarkMode={isDarkMode}
            onNavigate={navigateTo}
          />
        );

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

      case 'studies':
        return (
          <Studies
            isDarkMode={isDarkMode}
            onNavigate={navigateTo}
          />
        );

      case 'contact':
        return (
          <Contact
            isDarkMode={isDarkMode}
            onNavigate={navigateTo}
          />
        );

      case 'writings':
        return (
          <Writings
            isDarkMode={isDarkMode}
            onBack={() => navigateTo('about')}
            onOpenWriting={openWritingArticle}
          />
        );

      case 'writingArticle':
        return selectedWritingSlug ? (
          <WritingArticle
            slug={selectedWritingSlug}
            isDarkMode={isDarkMode}
            onBack={openWritingIndex}
            onOpenWriting={openWritingArticle}
          />
        ) : (
          <Writings
            isDarkMode={isDarkMode}
            onBack={() => navigateTo('about')}
            onOpenWriting={openWritingArticle}
          />
        );

      default: {
        const exhaustiveCheck: never = currentView;
        return exhaustiveCheck;
      }
    }
  };

  const isFixedView = currentView === 'hero';

  return (
    <div
      className={`flex w-full flex-col ${
        isDarkMode
          ? 'bg-black text-white'
          : 'bg-white text-black'
      }`}
    >
      {showLoader && (
        <Loader
          onReveal={() => setIsLoaded(true)}
          onComplete={() => setShowLoader(false)}
        />
      )}

      <div className="grain" />

      <div
        ref={leftLineRef}
        className={`fixed bottom-0 left-4 top-0 z-10 w-px transition-colors duration-1000 md:left-[5%] ${
          isDarkMode ? 'bg-zinc-900/50' : 'bg-zinc-200'
        }`}
      />

      <div
        ref={rightLineRef}
        className={`fixed bottom-0 right-4 top-0 z-10 w-px transition-colors duration-1000 md:right-[5%] ${
          isDarkMode ? 'bg-zinc-900/50' : 'bg-zinc-200'
        }`}
      />

      <Navbar
        currentTime={currentTime}
        isDarkMode={isDarkMode}
        onNavigate={navigateTo}
        currentView={currentView}
      />

      <main
        ref={mainContentRef}
        className={`relative z-20 flex min-h-screen w-full flex-col items-center px-[10px] pt-16 md:px-[20px] ${
          isFixedView
            ? 'h-screen overflow-hidden pb-4'
            : 'pb-[10px]'
        }`}
      >
        {isLoaded && renderContent()}
      </main>

      <Footer
        isDarkMode={isDarkMode}
        toggleMode={toggleMode}
      />
    </div>
  );
};

export default App;