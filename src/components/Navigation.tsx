import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Navigation: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const [navbarHeight, setNavbarHeight] = useState(64);

  useEffect(() => {
    if (navRef.current) {
      setNavbarHeight(navRef.current.offsetHeight);
    }
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  // Don't show navigation on login/register pages if not logged in
  if (!user && (location.pathname === '/login' || location.pathname === '/register')) {
    return (
      <nav className="navbar bg-base-200 shadow-lg">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex-1 gap-1 sm:gap-2">
            <Link 
              to="/" 
              className="btn btn-ghost btn-sm sm:btn-md"
            >
              <span className="hidden sm:inline">🏠 Home</span>
              <span className="sm:hidden">🏠</span>
            </Link>
            <Link 
              to="/wishlist" 
              className="btn btn-ghost btn-sm sm:btn-md"
            >
              <span className="hidden sm:inline">📋 Wishlist</span>
              <span className="sm:hidden">📋</span>
            </Link>
          </div>
          <div className="flex-none gap-1 sm:gap-2">
            {location.pathname === '/login' ? (
              <Link to="/register" className="btn btn-primary btn-sm sm:btn-md">
                <span className="hidden sm:inline">Sign Up</span>
                <span className="sm:hidden">Sign Up</span>
              </Link>
            ) : (
              <Link to="/login" className="btn btn-ghost btn-sm sm:btn-md">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    );
  }

  // Show full navigation for authenticated users
  if (user) {
    return (
      <nav ref={navRef} className="navbar bg-base-200 shadow-lg relative z-50">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex-1">
            <Link to="/" className="btn btn-ghost normal-case text-base sm:text-xl px-2 sm:px-4" onClick={() => setMobileMenuOpen(false)}>
              <span className="hidden sm:inline">🎁 Venema Wishlist</span>
              <span className="sm:hidden">🎁</span>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-none gap-2">
            <Link 
              to="/" 
              className={`btn ${location.pathname === '/' ? 'btn-active' : 'btn-ghost'}`}
            >
              🏠 Home
            </Link>
            <Link 
              to="/wishlist" 
              className={`btn ${location.pathname === '/wishlist' ? 'btn-active' : 'btn-ghost'}`}
            >
              📋 Wishlist
            </Link>
            {location.pathname !== '/profile' && (
              <Link 
                to="/profile" 
                className={`btn ${location.pathname === '/profile' ? 'btn-active' : 'btn-ghost'}`}
              >
                ✏️ My Profile
              </Link>
            )}
            {/* Secret Santa temporarily hidden */}
            {/* {location.pathname !== '/secret-santa' && (
              <Link 
                to="/secret-santa" 
                className={`btn ${location.pathname === '/secret-santa' ? 'btn-active' : 'btn-ghost'}`}
              >
                🎅 Secret Santa
              </Link>
            )} */}
            {isAdmin && location.pathname !== '/admin' && (
              <Link 
                to="/admin" 
                className={`btn ${location.pathname === '/admin' ? 'btn-active' : 'btn-ghost'}`}
              >
                🔐 Admin
              </Link>
            )}
            <button
              className="btn btn-ghost"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          {/* Mobile Menu Button */}
          <div className="lg:hidden flex-none">
            <button
              className={`btn btn-ghost btn-square transition-all duration-300 ${mobileMenuOpen ? 'btn-active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-1.5 w-5 h-5 justify-center items-center">
                <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
        {/* Mobile Menu Dropdown - Overlay */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              style={{ top: `${navbarHeight}px` }}
              onClick={() => setMobileMenuOpen(false)}
            ></div>
            {/* Menu */}
            <div 
              className="lg:hidden absolute top-full left-0 right-0 bg-base-200 border-t-2 border-base-300 shadow-2xl z-50 animate-in slide-in-from-top overflow-y-auto"
              style={{ maxHeight: `calc(100vh - ${navbarHeight}px)` }}
            >
              <div className="container mx-auto px-4 py-3">
                <div className="flex flex-col gap-1.5">
                  <Link 
                    to="/" 
                    className={`btn btn-block justify-start rounded-lg transition-all ${location.pathname === '/' ? 'btn-active btn-primary' : 'btn-ghost hover:bg-base-300'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-lg">🏠</span>
                    <span className="ml-2">Home</span>
                  </Link>
                  <Link 
                    to="/wishlist" 
                    className={`btn btn-block justify-start rounded-lg transition-all ${location.pathname === '/wishlist' ? 'btn-active btn-primary' : 'btn-ghost hover:bg-base-300'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-lg">📋</span>
                    <span className="ml-2">Wishlist</span>
                  </Link>
                  {location.pathname !== '/profile' && (
                    <Link 
                      to="/profile" 
                      className={`btn btn-block justify-start rounded-lg transition-all ${location.pathname === '/profile' ? 'btn-active btn-primary' : 'btn-ghost hover:bg-base-300'}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-lg">✏️</span>
                      <span className="ml-2">My Profile</span>
                    </Link>
                  )}
                  {/* Secret Santa temporarily hidden */}
                  {/* {location.pathname !== '/secret-santa' && (
                    <Link 
                      to="/secret-santa" 
                      className={`btn btn-block justify-start rounded-lg transition-all ${location.pathname === '/secret-santa' ? 'btn-active btn-primary' : 'btn-ghost hover:bg-base-300'}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-lg">🎅</span>
                      <span className="ml-2">Secret Santa</span>
                    </Link>
                  )} */}
                  {isAdmin && location.pathname !== '/admin' && (
                    <Link 
                      to="/admin" 
                      className={`btn btn-block justify-start rounded-lg transition-all ${location.pathname === '/admin' ? 'btn-active btn-primary' : 'btn-ghost hover:bg-base-300'}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-lg">🔐</span>
                      <span className="ml-2">Admin</span>
                    </Link>
                  )}
                  <div className="divider my-1"></div>
                  <button
                    className="btn btn-block justify-start btn-error rounded-lg transition-all hover:bg-error/20"
                    onClick={handleLogout}
                  >
                    <span className="text-lg">🚪</span>
                    <span className="ml-2">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    );
  }

  // Loading state
  if (loading) {
    return null;
  }

  // Default navigation for unauthenticated users on other pages
  return (
    <>
      {location.pathname === '/wishlist' && (
        <div className="fixed top-4 right-4 z-[9999] hidden sm:block">
          <div className="alert alert-info shadow-lg flex items-center gap-2 animate-in slide-in-from-right">
            <span>ℹ️</span>
            <span className="text-sm whitespace-nowrap">Register with your email to edit your profile</span>
          </div>
        </div>
      )}
      <nav className="navbar bg-base-200 shadow-lg">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex-1 gap-1 sm:gap-2">
            <Link 
              to="/" 
              className={`btn btn-sm sm:btn-md ${location.pathname === '/' ? 'btn-active' : 'btn-ghost'}`}
            >
              <span className="hidden sm:inline">🏠 Home</span>
              <span className="sm:hidden">🏠</span>
            </Link>
            <Link 
              to="/wishlist" 
              className={`btn btn-sm sm:btn-md ${location.pathname === '/wishlist' ? 'btn-active' : 'btn-ghost'}`}
            >
              <span className="hidden sm:inline">📋 Wishlist</span>
              <span className="sm:hidden">📋</span>
            </Link>
          </div>
          <div className="flex-none gap-1 sm:gap-2 items-center">
            <Link to="/login" className="btn btn-primary btn-sm sm:btn-md">
              Login
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;

