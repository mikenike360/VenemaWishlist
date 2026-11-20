import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const accent = isLandingPage
    ? 'text-yellow-300 hover:text-yellow-200'
    : 'link link-primary';

  return (
    <footer 
      className={`footer footer-center py-4 sm:py-6 border-t relative z-20 ${
        isLandingPage 
          ? 'mt-auto bg-slate-900/95 backdrop-blur-md text-white border-slate-700 shadow-lg' 
          : 'bg-base-200 text-base-content border-base-300'
      }`}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm sm:text-base">
        <div className="flex items-center gap-2">
          <span>Made with</span>
          <span 
            className="inline-block text-red-500 text-lg sm:text-xl pulse-heart"
          >
            ❤️
          </span>
          <span>by</span>
          <a 
            href="https://venomlabs.xyz" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`font-semibold hover:underline ${accent}`}
          >
            VenomLabs
          </a>
        </div>
        <span className={isLandingPage ? 'text-slate-500' : 'text-base-content/40'} aria-hidden>
          ·
        </span>
        <Link to="/credits" className={`font-semibold hover:underline ${accent}`}>
          Credits
        </Link>
      </div>
    </footer>
  );
};

export default Footer;

