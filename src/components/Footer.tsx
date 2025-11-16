import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <footer 
      className={`footer footer-center py-4 sm:py-6 border-t relative z-20 ${
        isLandingPage 
          ? 'bg-slate-900/95 backdrop-blur-md text-white border-slate-700 shadow-lg' 
          : 'bg-base-200 text-base-content border-base-300'
      }`}
    >
      <div className="flex items-center gap-2 text-sm sm:text-base">
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
          className={`font-semibold hover:underline ${
            isLandingPage 
              ? 'text-yellow-300 hover:text-yellow-200' 
              : 'link link-primary'
          }`}
        >
          VenomLabs
        </a>
      </div>
    </footer>
  );
};

export default Footer;

