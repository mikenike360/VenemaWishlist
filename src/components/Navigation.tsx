import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Navigation: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Don't show navigation on login/register pages if not logged in
  if (!user && (location.pathname === '/login' || location.pathname === '/register')) {
    return (
      <nav className="navbar bg-base-200 shadow-lg">
        <div className="container mx-auto">
          <div className="flex-1">
            <Link to="/" className="btn btn-ghost normal-case text-xl">
              🎁 Venema Wishlist
            </Link>
          </div>
          <div className="flex-none gap-2">
            {location.pathname === '/login' ? (
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            ) : (
              <Link to="/login" className="btn btn-ghost">
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
      <nav className="navbar bg-base-200 shadow-lg">
        <div className="container mx-auto">
          <div className="flex-1">
            <Link to="/" className="btn btn-ghost normal-case text-xl">
              🎁 Venema Wishlist
            </Link>
          </div>
          <div className="flex-none gap-2">
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
            {location.pathname !== '/secret-santa' && (
              <Link 
                to="/secret-santa" 
                className={`btn ${location.pathname === '/secret-santa' ? 'btn-active' : 'btn-ghost'}`}
              >
                🎅 Secret Santa
              </Link>
            )}
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
        </div>
      </nav>
    );
  }

  // Loading state
  if (loading) {
    return null;
  }

  // Default navigation for unauthenticated users on other pages
  return (
    <nav className="navbar bg-base-200 shadow-lg">
      <div className="container mx-auto">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            🎁 Venema Wishlist
          </Link>
        </div>
        <div className="flex-none gap-2">
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

