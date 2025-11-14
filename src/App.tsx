//App.tsx

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import WishlistCard from './components/WishlistCard';
import CopyLinkButton from './components/CopyLinkButton';
import ExportWishlist from './components/ExportWishlist';
import Snowfall from './components/Snowfall';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AuthGuard from './components/auth/AuthGuard';
import AdminDashboard from './components/admin/AdminDashboard';
import ProfileEdit from './components/profile/ProfileEdit';
import ProfileClaim from './components/profile/ProfileClaim';
import SecretSanta from './components/SecretSanta';
import LandingPage from './components/landing';
import { useAuth } from './contexts/AuthContext';
import { useToast } from './components/Toast';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { supabase } from './lib/supabase';
import { Profile, User } from './types';
import backgroundMusic from './assets/audio/jingle_bells.mp3';
import michaelImage from './assets/images/michael.jpg';
import amandaImage from './assets/images/amanda.jpg';
import joeyImage from './assets/images/joey.jpg';
import aliyaImage from './assets/images/aliya.jpg';
import eliImage from './assets/images/eli.jpg';
import ellaImage from './assets/images/ella.jpg';
import micahImage from './assets/images/micah.jpg';
import carrieImage from './assets/images/carrie.jpg';
import rockImage from './assets/images/rock.jpg';
import kaylaImage from './assets/images/kayla.jpg';
import mattImage from './assets/images/matt.jpg';
import sonnyImage from './assets/images/sonny.jpg';
import barbImage from './assets/images/barb.jpg';
import mikeImage from './assets/images/mike.jpg';
import ashleyImage from './assets/images/ashley.jpg';
import brittanyImage from './assets/images/brittany.jpg';
import wendyImage from './assets/images/wendy.jpg';
import karlImage from './assets/images/karl.jpg';
import marilynImage from './assets/images/marilyn.jpg';
import bobImage from './assets/images/bob.jpg';
import nickImage from './assets/images/nick.jpg';
import nateImage from './assets/images/nate.jpg';
import chadImage from './assets/images/chad.jpg';
import johnImage from './assets/images/john.jpg';
import roenImage from './assets/images/roen.jpg';
import nolleImage from './assets/images/nolle.jpg';
import toshImage from './assets/images/tosh.jpg';
import morganImage from './assets/images/morgan.jpg';

// Fallback images mapping (for profiles without images)
const fallbackImages: Record<string, string> = {
  'Michael': michaelImage,
  'Amanda': amandaImage,
  'Joey': joeyImage,
  'Aliya': aliyaImage,
  'Elijah': eliImage,
  'Ella': ellaImage,
  'Micah': micahImage,
  'Carrie': carrieImage,
  'Rock': rockImage,
  'Kayla': kaylaImage,
  'Matt': mattImage,
  'Sonny': sonnyImage,
  'Barbara': barbImage,
  'Mike': mikeImage,
  'Ashley': ashleyImage,
  'Brittany': brittanyImage,
  'Wendy': wendyImage,
  'Karl': karlImage,
  'Marilyn': marilynImage,
  'Bob': bobImage,
  'Nick': nickImage,
  'Nathaniel': nateImage,
  'Chad': chadImage,
  'John': johnImage,
  'Roen': roenImage,
  'Noli': nolleImage,
  'Tosh': toshImage,
  'Morgan': morganImage,
};

// Shuffle function
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Convert Profile to User format for WishlistCard
const profileToUser = (profile: Profile): User => {
  return {
    name: profile.name,
    image: profile.image_url || fallbackImages[profile.name] || '',
    wishlistLink: profile.wishlist_link || 'https://www.amazon.com/',
  };
};

const WishlistPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  useKeyboardShortcuts(); // Enable keyboard shortcuts
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const audioRef = useRef<HTMLAudioElement>(new Audio(backgroundMusic));
  const [allFlipped, setAllFlipped] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [shuffledUsers, setShuffledUsers] = useState<User[]>([]);
  const [theme, setTheme] = useState<string>('winter');
  const [showThemeList, setShowThemeList] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const themeSelectorRef = useRef<HTMLDivElement>(null);

  // Check if user has claimed any profiles
  const checkUserProfile = useCallback(async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('claimed_by', user.id)
      .limit(1);

    // Profile check result can be used for future features
    return !!data && data.length > 0;
  }, [user]);

  useEffect(() => {
    if (user) {
      checkUserProfile();
    }
  }, [user, checkUserProfile]);

  // Fetch profiles from Supabase
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching profiles:', error);
    } else {
      setProfiles(data || []);
      const users = (data || []).map(profileToUser);
      setShuffledUsers(shuffleArray(users));
    }
    setLoading(false);
  };

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

  // Cleanup: Stop music when component unmounts (navigating away)
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    };
  }, []);

  // Update theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Handle clicks outside theme selector
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeSelectorRef.current && !themeSelectorRef.current.contains(event.target as Node)) {
        setShowThemeList(false);
      }
    };

    if (showThemeList) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showThemeList]);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return shuffledUsers;
    }
    return shuffledUsers.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, shuffledUsers]);

  const toggleMusic = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleAllFlipped = () => {
    setAllFlipped((prev) => !prev);
  };

  const handleShuffle = () => {
    const users = profiles.map(profileToUser);
    setShuffledUsers(shuffleArray(users));
    setAllFlipped(false);
    showToast('Cards shuffled!', 'success');
  };

  const themes = [
    'acid', 'aqua', 'autumn', 'black', 'bumblebee', 'business', 
    'coffee', 'corporate', 'cupcake', 'cmyk', 'cyberpunk', 'dark', 
    'dracula', 'emerald', 'fantasy', 'forest', 'garden', 'halloween', 
    'lemonade', 'light', 'lofi', 'luxury', 'night', 'pastel', 
    'retro', 'synthwave', 'valentine', 'wireframe', 'winter'
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-base-100">
      <Snowfall />
      <Header />
      <Navigation />
      
      {/* Controls Section */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col gap-4 sm:gap-6 mb-4 sm:mb-6 no-print">
          {/* Search Input */}
          <div className="form-control w-full sm:max-w-md mx-auto">
            <label className="label py-1 sm:py-2">
              <span className="label-text font-bold text-sm sm:text-base">🔍 Search Family Members</span>
            </label>
            <input
              type="text"
              placeholder="Type a name..."
              className="input input-bordered input-primary w-full input-sm sm:input-md focus:input-primary focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Collapsible Menu Button */}
          <div className="flex justify-center">
            <div className="collapse collapse-arrow bg-base-200 shadow-md rounded-lg w-full sm:max-w-2xl">
              <input 
                type="checkbox" 
                checked={menuOpen}
                onChange={(e) => setMenuOpen(e.target.checked)}
              />
              <div className="collapse-title text-lg font-semibold flex items-center justify-center gap-2">
                <span>⚙️</span>
                <span>Actions & Settings</span>
              </div>
              <div className="collapse-content">
                <div className="flex flex-col gap-4 pt-2">
                  {/* Main Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
                    {/* Flip All Button */}
                    <button 
                      className={`btn btn-sm sm:btn-md flex-1 sm:flex-none shadow-md hover:shadow-lg transition-all ${allFlipped ? 'btn-secondary' : 'btn-primary'} gap-2 font-semibold`}
                      onClick={() => {
                        toggleAllFlipped();
                        setMenuOpen(false);
                      }}
                    >
                      <span className="text-lg">{allFlipped ? '🎁' : '✨'}</span>
                      <span>{allFlipped ? 'Reset Presents!' : 'Open Presents!'}</span>
                    </button>

                    {/* Shuffle Button */}
                    <button 
                      className="btn btn-sm sm:btn-md btn-accent gap-2 flex-1 sm:flex-none shadow-md hover:shadow-lg transition-all font-semibold"
                      onClick={() => {
                        handleShuffle();
                        setMenuOpen(false);
                      }}
                    >
                      <span className="text-lg">🔀</span>
                      <span>Shuffle Cards</span>
                    </button>

                    {/* Theme Selector */}
                    <div className="relative flex-1 sm:flex-none" ref={themeSelectorRef}>
                      <button 
                        className="btn btn-sm sm:btn-md btn-outline gap-2 w-full sm:w-auto shadow-md hover:shadow-lg transition-all font-semibold"
                        onClick={() => setShowThemeList(true)}
                      >
                        <span className="text-lg">🎨</span>
                        <span>Theme</span>
                      </button>
                      {showThemeList && (
                        <div className="absolute top-full left-0 right-0 sm:right-auto mt-2 z-50 animate-in fade-in slide-in-from-top-2">
                          <div className="card bg-base-100 shadow-xl border-2 border-base-300">
                            <div className="card-body p-2 max-h-96 overflow-y-auto w-full sm:w-56">
                              <ul className="menu menu-vertical w-full">
                                {themes.map((t) => (
                                  <li key={t}>
                                    <button
                                      onClick={() => {
                                        setTheme(t);
                                        setShowThemeList(false);
                                        showToast(`Theme changed to ${t.charAt(0).toUpperCase() + t.slice(1)}`, 'info');
                                      }}
                                      className={`${theme === t ? 'active bg-primary text-primary-content' : 'hover:bg-base-200'} flex items-center justify-between text-sm rounded-lg transition-all`}
                                    >
                                      <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                                      {theme === t && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                      )}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Secondary Actions Row */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
                    {/* Music Controls */}
                    <div className="card bg-base-100 shadow-md p-3 sm:p-4 flex-1 sm:flex-none sm:min-w-[200px]">
                      <div className="flex flex-col gap-2">
                        <button 
                          className={`btn btn-sm sm:btn-md w-full ${isPlaying ? 'btn-error' : 'btn-success'} gap-2 shadow-md hover:shadow-lg transition-all font-semibold`}
                          onClick={toggleMusic}
                        >
                          <span className="text-lg">{isPlaying ? '🔇' : '🔊'}</span>
                          <span>{isPlaying ? 'Stop Music' : 'Play Music'}</span>
                        </button>
                        {isPlaying && (
                          <div className="flex items-center gap-2 bg-base-200 rounded-lg p-2">
                            <span className="text-sm">🔉</span>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={volume}
                              onChange={(e) => setVolume(parseFloat(e.target.value))}
                              className="range range-xs range-warning flex-1"
                            />
                            <span className="text-xs font-semibold w-10">{Math.round(volume * 100)}%</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Copy Link Button */}
                    <div className="flex-1 sm:flex-none">
                      <CopyLinkButton 
                        url={window.location.href}
                        label="Copy Link"
                        className="btn-sm sm:btn-md w-full sm:w-auto shadow-md hover:shadow-lg transition-all"
                      />
                    </div>

                    {/* Export Wishlist */}
                    <div className="flex-1 sm:flex-none w-full sm:w-auto">
                      <ExportWishlist profiles={profiles} className="w-full sm:w-auto" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {searchQuery && (
          <div className="text-center mb-4">
            <div className="badge badge-info badge-md sm:badge-lg">
              Found {filteredUsers.length} {filteredUsers.length === 1 ? 'person' : 'people'}
            </div>
          </div>
        )}
      </div>

            {/* Cards Grid */}
            <main className="container mx-auto px-2 sm:px-4 pb-6 sm:pb-8 print:px-0">
        {filteredUsers.length > 0 ? (
          <div className="wishlist-grid">
            {filteredUsers.map((user, index) => (
              <WishlistCard key={`${user.name}-${index}`} user={user} isFlipped={allFlipped} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl mb-4">🔍</div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">No matches found</h2>
            <p className="text-sm sm:text-base text-base-content/70">Try searching for a different name</p>
          </div>
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/wishlist" element={<WishlistPage />} />
            {/* Secret Santa temporarily hidden */}
            {/* <Route
              path="/secret-santa"
              element={
                <AuthGuard>
                  <SecretSanta />
                </AuthGuard>
              }
            /> */}
      <Route
        path="/admin"
        element={
          <AuthGuard requireAdmin={true}>
            <AdminDashboard />
          </AuthGuard>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthGuard>
            <ProfileEdit />
          </AuthGuard>
        }
      />
      <Route
        path="/claim"
        element={
          <AuthGuard>
            <ProfileClaim />
          </AuthGuard>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
