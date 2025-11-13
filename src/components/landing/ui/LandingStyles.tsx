import React from 'react';

export const LandingStyles: React.FC = () => {
  return (
    <style>{`
      @keyframes fade-in {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fade-in-up {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes bounce-slow {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }
      
      @keyframes gradient {
        0%, 100% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
      }
      
      .animate-fade-in {
        animation: fade-in 0.8s ease-out;
      }
      
      .animate-fade-in-up {
        animation: fade-in-up 1s ease-out 0.2s both;
      }
      
      .animate-fade-in-delay {
        animation: fade-in-up 1s ease-out 0.4s both;
      }
      
      .animate-fade-in-delay-2 {
        animation: fade-in-up 1s ease-out 0.6s both;
      }
      
      .animate-bounce-slow {
        animation: bounce-slow 3s ease-in-out infinite;
      }
      
      .animate-gradient {
        background-size: 200% auto;
        animation: gradient 3s linear infinite;
      }
    `}</style>
  );
};

