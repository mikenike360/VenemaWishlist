import React, { useState } from 'react';
import { useToast } from './Toast';

interface CopyLinkButtonProps {
  url: string;
  label?: string;
  className?: string;
}

const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({ url, label = 'Copy Link', className = '' }) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showToast('Link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast('Failed to copy link', 'error');
    }
  };

  return (
    <button
      className={`btn btn-outline gap-1.5 sm:gap-2 ${className}`}
      onClick={handleCopy}
    >
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-[10px] sm:text-xs">Copied!</span>
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] sm:text-xs">
            <span className="sm:hidden">Copy</span>
            <span className="hidden sm:inline">{label}</span>
          </span>
        </>
      )}
    </button>
  );
};

export default CopyLinkButton;

