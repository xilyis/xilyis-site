import React from 'react';

interface PageFooterProps {
  isDarkMode: boolean;
}

const PageFooter: React.FC<PageFooterProps> = ({ isDarkMode }) => {
  return (
    <div className={`w-full border-t border-current/10 pt-8 pb-0 ${isDarkMode ? 'text-white' : 'text-black'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8">
        
        {/* COLUMN 1: Navigation */}
        <div className="space-y-4">
          <h3 className="text-[9px] tracking-[0.4em] uppercase font-bold opacity-60 mb-4">Index</h3>
          <ul className="space-y-3 text-[7px] tracking-[0.2em] uppercase opacity-40">
            <li><a href="#" className="hover:opacity-100 transition-opacity">Hero</a></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">About</a></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">Artifacts</a></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">Contact</a></li>
          </ul>
        </div>

        {/* COLUMN 2: Contact */}
        <div className="space-y-4">
          <h3 className="text-[9px] tracking-[0.4em] uppercase font-bold opacity-60 mb-4">Connect</h3>
          <ul className="space-y-3 text-[7px] tracking-[0.2em] uppercase opacity-40">
            <li><a href="mailto:info@xilyas.com" className="hover:opacity-100 transition-opacity">Email</a></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">Instagram</a></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">Twitter/X</a></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">LinkedIn</a></li>
          </ul>
        </div>

        {/* COLUMN 3: Legal/Info */}
        <div className="space-y-4">
          <h3 className="text-[9px] tracking-[0.4em] uppercase font-bold opacity-60 mb-4">Legal</h3>
          <ul className="space-y-3 text-[7px] tracking-[0.2em] uppercase opacity-40">
            <li><a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">Cookie Notice</a></li>
            <li><span className="cursor-default">© 2024 XILYAS</span></li>
          </ul>
        </div>

        {/* COLUMN 4: System Info */}
        <div className="space-y-4">
          <h3 className="text-[9px] tracking-[0.4em] uppercase font-bold opacity-60 mb-4">System</h3>
          <ul className="space-y-3 text-[7px] tracking-[0.2em] uppercase opacity-40">
            <li className="cursor-default">v1.0.0</li>
            <li className="cursor-default">UTC: <span className="font-mono">14:23:45</span></li>
            <li className="cursor-default">Region: JP-Tokyo</li>
            <li className="cursor-default">Status: Online</li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center border-t border-current/10 pt-6 text-[6px] tracking-[0.2em] uppercase opacity-30">
        <div>XILYAS // ARCHIVE</div>
        <div>All artifacts protected under digital copyright law.</div>
      </div>
    </div>
  );
};

export default PageFooter;