
import React from 'react';

interface FooterProps {
  isDarkMode: boolean;
  toggleMode: () => void;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode, toggleMode }) => {
  const today = new Date().getFullYear();

  const releaseNotes = [
    { v: '1.0.4', d: 'Typography & Mobile optimization' },
    { v: '1.0.3', d: 'Neural assistant integration' },
    { v: '1.0.2', d: 'Dark mode synthesis' }
  ];

  return (
    <footer className="fixed bottom-0 left-0 w-full h-16 md:h-20 z-50 flex items-center justify-between px-6 md:px-10 text-[6px] md:text-[7px] tracking-[0.3em] md:tracking-[0.35em] font-bold pointer-events-none">
      {/* Left: Interactive Mode Toggle */}
      <div className="flex-1 flex justify-start pointer-events-auto">
        <button 
          onClick={toggleMode}
          className={`opacity-40 hover:opacity-100 transition-all duration-500 uppercase border-b border-transparent hover:border-current py-1 hover:tracking-[0.35em] md:hover:tracking-[0.45em] ${isDarkMode ? 'text-white' : 'text-black'}`}
        >
          {isDarkMode ? 'LIGHT' : 'DARK'}
        </button>
      </div>

      {/* Center: Version and Date with Tooltip */}
      <div className="hidden md:flex items-center gap-4 pointer-events-auto relative group">
        {/* Tooltip */}
        <div className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 p-3 border transition-all duration-500 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none backdrop-blur-md ${isDarkMode ? 'bg-black/80 border-zinc-800 text-zinc-400' : 'bg-white/80 border-zinc-200 text-zinc-600'}`}>
          <div className="text-[6px] tracking-[0.25em] uppercase mb-2 opacity-40 border-b border-current pb-2">Archive Logs</div>
          <div className="space-y-2">
            {releaseNotes.map((note) => (
              <div key={note.v} className="flex flex-col gap-0.5">
                <span className={`text-[7px] font-bold tracking-[0.15em] ${isDarkMode ? 'text-white' : 'text-black'}`}>V{note.v}</span>
                <span className="text-[6px] leading-relaxed font-light opacity-80">{note.d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Display Text */}
        <div className={`flex items-center gap-4 opacity-30 font-medium tracking-[0.3em] transition-opacity duration-500 group-hover:opacity-100 cursor-default ${isDarkMode ? 'text-white' : 'text-black'}`}>
          <span className="border-b border-transparent group-hover:border-current pb-0.5 transition-all">V1.0.4</span>
          <div className="w-0.5 h-0.5 rounded-full bg-current opacity-40"></div>
          <span>ARCHIVE_{today}</span>
        </div>
      </div>

      {/* Right: Minimal Branding */}
      <div className={`flex-1 flex justify-end uppercase whitespace-nowrap pointer-events-auto opacity-30 font-bold tracking-[0.3em] md:tracking-[0.35em] transition-all duration-700 hover:opacity-80 cursor-default ${isDarkMode ? 'text-white' : 'text-black'}`}>
        XILYAS_SYS
      </div>
    </footer>
  );
};

export default Footer;
