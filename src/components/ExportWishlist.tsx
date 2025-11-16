import React from 'react';
import { Profile } from '../types';

interface ExportWishlistProps {
  profiles: Profile[];
  className?: string;
}

const ExportWishlist: React.FC<ExportWishlistProps> = ({ profiles, className = '' }) => {
  const handleExportPDF = () => {
    window.print();
  };

  const handleExportText = () => {
    const text = profiles
      .map((profile) => {
        return `${profile.name}\n${profile.wishlist_link || 'No wishlist link'}\n${'='.repeat(50)}`;
      })
      .join('\n\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wishlist-export.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`dropdown dropdown-end ${className}`}>
      <label tabIndex={0} className={`btn btn-sm md:btn-md btn-outline gap-2 shadow-md hover:shadow-lg transition-all font-semibold ${className.includes('w-full') ? 'w-full' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export
      </label>
      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50">
        <li>
          <button onClick={handleExportPDF}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print/PDF
          </button>
        </li>
        <li>
          <button onClick={handleExportText}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export as Text
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ExportWishlist;

