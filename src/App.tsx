//App.tsx

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
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
import Credits from './components/Credits';
import { useAuth } from './contexts/AuthContext';
import { useToast } from './components/Toast';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { supabase } from './lib/supabase';
import { Profile, User } from './types';
import { profileToUser } from './lib/profiles';
import backgroundMusic from './assets/audio/christmas_chill.mp3';

// Shuffle function
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
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
      <Header 
        isPlaying={isPlaying}
        volume={volume}
        toggleMusic={toggleMusic}
        setVolume={setVolume}
      />
      <Navigation />
      
      {/* Controls Section */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col gap-4 sm:gap-6 mb-4 sm:mb-6 no-print">
          {/* Search Input */}
          <fieldset className="fieldset w-full max-w-xs sm:max-w-md mx-auto">
            <legend className="fieldset-legend font-bold text-sm sm:text-base">🔍 Search Family Members</legend>
            <input
              type="text"
              placeholder="Type a name..."
              className="input input-primary w-full input-sm sm:input-md focus:input-primary focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </fieldset>

          {/* Desktop Actions - Show buttons directly */}
          <div className="hidden sm:flex flex-wrap gap-3 justify-center items-center mb-4 sm:mb-6 no-print">
            {/* Flip All Button */}
            <button 
              className={`btn btn-sm md:btn-md shadow-md hover:shadow-lg transition-all ${allFlipped ? 'btn-secondary' : 'btn-primary'} gap-2 font-semibold`}
              onClick={toggleAllFlipped}
            >
              <span className="text-lg">{allFlipped ? '🎁' : '✨'}</span>
              <span>{allFlipped ? 'Reset Presents!' : 'Open Presents!'}</span>
            </button>

            {/* Shuffle Button */}
            <button 
              className="btn btn-sm md:btn-md btn-accent gap-2 shadow-md hover:shadow-lg transition-all font-semibold"
              onClick={handleShuffle}
            >
              <span className="text-lg">🔀</span>
              <span>Shuffle Cards</span>
            </button>

            {/* Copy Link Button */}
            <CopyLinkButton 
              url={window.location.href}
              label="Copy Link"
              className="btn-sm md:btn-md shadow-md hover:shadow-lg transition-all"
            />

            {/* Export Wishlist */}
            <ExportWishlist profiles={profiles} className="" />
          </div>

          {/* Mobile Actions - Icon-only buttons */}
          <div className="flex sm:hidden justify-center gap-2 mb-4 no-print">
            {/* Flip All Button */}
            <button 
              className={`btn btn-circle btn-sm ${allFlipped ? 'btn-secondary' : 'btn-primary'} shadow-md hover:shadow-lg transition-all`}
              onClick={toggleAllFlipped}
              aria-label={allFlipped ? 'Reset Presents' : 'Open Presents'}
            >
              <span className="text-lg">{allFlipped ? '🎁' : '✨'}</span>
            </button>

            {/* Shuffle Button */}
            <button 
              className="btn btn-circle btn-sm btn-accent shadow-md hover:shadow-lg transition-all"
              onClick={handleShuffle}
              aria-label="Shuffle Cards"
            >
              <span className="text-lg">🔀</span>
            </button>

            {/* Copy Link Button - Icon only */}
            <button
              className="btn btn-circle btn-sm btn-outline shadow-md hover:shadow-lg transition-all"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  showToast('Link copied to clipboard!', 'success');
                } catch (err) {
                  showToast('Failed to copy link', 'error');
                }
              }}
              aria-label="Copy Link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Export Wishlist - Icon only with dropdown */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-circle btn-sm btn-outline shadow-md hover:shadow-lg transition-all" aria-label="Export Wishlist">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50 mt-2">
                <li>
                  <button onClick={() => window.print()}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print/PDF
                  </button>
                </li>
                <li>
                  <button onClick={() => {
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
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export as Text
                  </button>
                </li>
              </ul>
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
      <Footer />
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
      <Route path="/credits" element={<Credits />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/wishlist" element={<Navigate to="/" replace />} />
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
