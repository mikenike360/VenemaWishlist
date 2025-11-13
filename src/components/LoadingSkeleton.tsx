import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'profile' | 'text';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="card bg-base-200 shadow-xl animate-pulse">
            <div className="card-body items-center text-center p-6">
              <div className="w-24 h-24 rounded-full bg-base-300 mb-4"></div>
              <div className="h-6 w-32 bg-base-300 rounded mb-2"></div>
              <div className="h-4 w-24 bg-base-300 rounded"></div>
            </div>
          </div>
        );
      case 'list':
        return (
          <div className="card bg-base-200 shadow animate-pulse">
            <div className="card-body">
              <div className="h-6 w-3/4 bg-base-300 rounded mb-2"></div>
              <div className="h-4 w-1/2 bg-base-300 rounded mb-2"></div>
              <div className="h-4 w-1/3 bg-base-300 rounded"></div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="flex flex-col items-center animate-pulse">
            <div className="w-32 h-32 rounded-full bg-base-300 mb-4"></div>
            <div className="h-8 w-48 bg-base-300 rounded mb-2"></div>
            <div className="h-4 w-32 bg-base-300 rounded"></div>
          </div>
        );
      case 'text':
        return (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 w-full bg-base-300 rounded"></div>
            <div className="h-4 w-5/6 bg-base-300 rounded"></div>
            <div className="h-4 w-4/6 bg-base-300 rounded"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>{renderSkeleton()}</React.Fragment>
      ))}
    </>
  );
};

export default LoadingSkeleton;

