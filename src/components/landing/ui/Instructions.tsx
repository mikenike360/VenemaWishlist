import React from 'react';

export const Instructions: React.FC = () => {
  return (
    <div className="text-center text-white/80 max-w-2xl mx-auto animate-fade-in-delay-2">
      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/20 shadow-lg">
        <span className="text-lg sm:text-xl">💡</span>
        <p className="text-xs sm:text-sm font-medium">
          Click and drag to explore • Scroll to zoom • Right-click to pan
        </p>
      </div>
    </div>
  );
};

