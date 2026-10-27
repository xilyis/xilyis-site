import React from 'react';
import { FEATURES } from '../featureFlags';

type PageView =
  | 'hero'
  | 'about'
  | 'artifacts'
  | 'studies'
  | 'contact'
  | 'writings';

interface PageFooterProps {
  isDarkMode: boolean;
  onNavigate: (view: PageView) => void;
}

const PageFooter: React.FC<PageFooterProps> = ({
  isDarkMode,
  onNavigate,
}) => {
  const textColor = isDarkMode ? 'text-white' : 'text-black';

  return (
    <div
      className={`w-full border-t border-current/10 pt-8 pb-0 ${textColor}`}
    >
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-4">
        {/* COLUMN 1: Navigation */}
        <div className="space-y-4">
          <h3 className="mb-4 text-[9px] font-bold uppercase tracking-[0.4em] opacity-60">
            Index
          </h3>

          <ul className="space-y-3 text-[7px] uppercase tracking-[0.2em] opacity-40">
            <li>
              <button
                type="button"
                onClick={() => onNavigate('hero')}
                className="transition-opacity hover:opacity-100"
              >
                Hero
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="transition-opacity hover:opacity-100"
              >
                About
              </button>
            </li>

            {FEATURES.artifacts && (
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('artifacts')}
                  className="transition-opacity hover:opacity-100"
                >
                  Artifacts
                </button>
              </li>
            )}

            <li>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="transition-opacity hover:opacity-100"
              >
                Contact
              </button>
            </li>

            {/* Writings is hidden until FEATURES.writings is enabled (featureFlags.ts) */}
            {FEATURES.writings && (
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('writings')}
                  className="transition-opacity hover:opacity-100"
                >
                  Writings
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* COLUMN 2: Contact */}
        <div className="space-y-4">
          <h3 className="mb-4 text-[9px] font-bold uppercase tracking-[0.4em] opacity-60">
            Connect
          </h3>

          <ul className="space-y-3 text-[7px] uppercase tracking-[0.2em] opacity-40">
            <li>
              <a
                href="mailto:info@xilyas.com"
                className="transition-opacity hover:opacity-100"
              >
                Email
              </a>
            </li>
            <li>
              <a href="#" className="transition-opacity hover:opacity-100">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="transition-opacity hover:opacity-100">
                Twitter/X
              </a>
            </li>
            <li>
              <a href="#" className="transition-opacity hover:opacity-100">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

        {/* COLUMN 3: Legal/Info */}
        <div className="space-y-4">
          <h3 className="mb-4 text-[9px] font-bold uppercase tracking-[0.4em] opacity-60">
            Legal
          </h3>

          <ul className="space-y-3 text-[7px] uppercase tracking-[0.2em] opacity-40">
            <li>
              <a href="#" className="transition-opacity hover:opacity-100">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="transition-opacity hover:opacity-100">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="transition-opacity hover:opacity-100">
                Cookie Notice
              </a>
            </li>
            <li>
              <span className="cursor-default">© 2024 XILYAS</span>
            </li>
          </ul>
        </div>

        {/* COLUMN 4: System Info */}
        <div className="space-y-4">
          <h3 className="mb-4 text-[9px] font-bold uppercase tracking-[0.4em] opacity-60">
            System
          </h3>

          <ul className="space-y-3 text-[7px] uppercase tracking-[0.2em] opacity-40">
            <li className="cursor-default">v1.0.0</li>
            <li className="cursor-default">
              UTC: <span className="font-mono">14:23:45</span>
            </li>
            <li className="cursor-default">Region: JP-Tokyo</li>
            <li className="cursor-default">Status: Online</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col items-center justify-between border-t border-current/10 pt-6 text-[6px] uppercase tracking-[0.2em] opacity-30 md:flex-row">
        <div>XILYAS // ARCHIVE</div>
        <div>All artifacts protected under digital copyright law.</div>
      </div>
    </div>
  );
};

export default PageFooter;