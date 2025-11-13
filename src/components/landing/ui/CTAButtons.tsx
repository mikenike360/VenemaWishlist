import React from 'react';
import { Link } from 'react-router-dom';

export const CTAButtons: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-4 sm:mb-6 animate-fade-in-up">
      <Link
        to="/login"
        className="group relative btn btn-primary btn-md sm:btn-lg text-base sm:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 shadow-2xl hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 font-semibold rounded-full overflow-hidden"
      >
        <span className="relative z-10 flex items-center gap-2">
          <span className="text-xl sm:text-2xl">🎅</span>
          <span>Sign In</span>
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      </Link>
      <Link
        to="/register"
        className="group relative btn btn-secondary btn-md sm:btn-lg text-base sm:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 shadow-2xl hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 font-semibold rounded-full overflow-hidden"
      >
        <span className="relative z-10 flex items-center gap-2">
          <span className="text-xl sm:text-2xl">✨</span>
          <span>Join the Family</span>
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      </Link>
    </div>
  );
};

