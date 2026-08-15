
import React from 'react';

interface FooterProps {
  isDarkMode: boolean;
  toggleMode: () => void;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode, toggleMode }) => {
  const today = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 w-full h-16 md:h-20 z-50 flex items-end justify-between px-6 md:px-10 text-[6px] md:text-[7px] tracking-[0.3em] md:tracking-[0.35em] font-bold pointer-events-none">
      {/* Left: Interactive Mode Toggle */}
      <div className="flex-1 flex justify-start pointer-events-auto">
        <button 
          onClick={toggleMode}
          className={`opacity-40 hover:opacity-100 transition-all duration-500 uppercase border-b border-transparent hover:border-current py-1 hover:tracking-[0.35em] md:hover:tracking-[0.45em] ${isDarkMode ? 'text-white' : 'text-black'}`}
        >
          {isDarkMode ? 'LIGHT' : 'DARK'}
        </button>
      </div>

      {/* Right: Minimal Branding */}
      <div className={`flex-1 flex justify-end uppercase whitespace-nowrap pointer-events-auto opacity-30 font-bold tracking-[0.3em] md:tracking-[0.35em] transition-all duration-700 hover:opacity-80 cursor-default ${isDarkMode ? 'text-white' : 'text-black'}`}>
        V1.0.0
      </div>

    </footer>
  );
};

export default Footer;
