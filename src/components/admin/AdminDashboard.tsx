import React, { useState, useEffect, useRef } from 'react';
import Navigation from '../Navigation';
import Header from '../Header';
import Footer from '../Footer';
import ApprovalList from './ApprovalList';
import ProfileManagement from './ProfileManagement';
import { useToast } from '../Toast';
import backgroundMusic from '../../assets/audio/jingle_bells.mp3';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'profiles'>('approvals');
  const { showToast } = useToast();

  // Music and theme state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const audioRef = useRef<HTMLAudioElement>(new Audio(backgroundMusic));
  const [theme, setTheme] = useState<string>(() => {
    const savedTheme = localStorage.getItem('wishlist-theme');
    return savedTheme || 'winter';
  });
  const [showThemeList, setShowThemeList] = useState<boolean>(false);

  const themes = [
    'acid', 'aqua', 'autumn', 'black', 'bumblebee', 'business', 
    'coffee', 'corporate', 'cupcake', 'cmyk', 'cyberpunk', 'dark', 
    'dracula', 'emerald', 'fantasy', 'forest', 'garden', 'halloween', 
    'lemonade', 'light', 'lofi', 'luxury', 'night', 'pastel', 
    'retro', 'synthwave', 'valentine', 'wireframe', 'winter'
  ];

  // Effect to handle music play/pause and volume
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;
    if (isPlaying) {
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
      audio.loop = true;
    } else {
      audio.pause();
    }
  }, [isPlaying, volume]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioRef.current.pause();
      audioRef.current.src = '';
    };
  }, []);

  // Update theme and persist to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wishlist-theme', theme);
  }, [theme]);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Header
        isPlaying={isPlaying}
        volume={volume}
        toggleMusic={toggleMusic}
        setVolume={setVolume}
        theme={theme}
        themes={themes}
        setTheme={setTheme}
        showThemeList={showThemeList}
        setShowThemeList={setShowThemeList}
        showToast={showToast}
      />
      <Navigation />
      <div className="container mx-auto px-2 sm:px-4 py-2">
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-xl sm:text-2xl">🔐</div>
              <div>
                <h1 className="card-title text-lg sm:text-xl">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-base-content/70 mt-0.5">Manage user approvals and profiles</p>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="tabs tabs-boxed mb-3 bg-base-200 overflow-x-auto">
              <button
                className={`tab gap-1 sm:gap-2 transition-all text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'approvals' 
                    ? 'tab-active bg-primary text-primary-content' 
                    : 'hover:bg-base-300'
                }`}
                onClick={() => setActiveTab('approvals')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">User Approvals</span>
                <span className="sm:hidden">Approvals</span>
              </button>
              <button
                className={`tab gap-1 sm:gap-2 transition-all text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'profiles' 
                    ? 'tab-active bg-primary text-primary-content' 
                    : 'hover:bg-base-300'
                }`}
                onClick={() => setActiveTab('profiles')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span className="hidden sm:inline">Profile Management</span>
                <span className="sm:hidden">Profiles</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-2 max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-250px)] overflow-y-auto">
              {activeTab === 'approvals' && <ApprovalList />}
              {activeTab === 'profiles' && <ProfileManagement />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;

