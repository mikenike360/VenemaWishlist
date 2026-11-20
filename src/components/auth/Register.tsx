import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Navigation from '../Navigation';
import Header from '../Header';
import Footer from '../Footer';
import { useToast } from '../Toast';
import backgroundMusic from '../../assets/audio/christmas_chill.mp3';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [requestedName, setRequestedName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const { showToast } = useToast();

  // Music state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const audioRef = useRef<HTMLAudioElement>(new Audio(backgroundMusic));
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

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  // Fetch available profile names
  const [availableNames, setAvailableNames] = useState<string[]>([]);
  
  React.useEffect(() => {
    const fetchAvailableNames = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('name')
        .is('claimed_by', null);
      
      if (data) {
        setAvailableNames(data.map(p => p.name));
      }
    };
    
    fetchAvailableNames();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!requestedName.trim()) {
      setError('Please select which family member you are');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, requestedName);
    
    if (error) {
      setError(error.message);
      showToast('Registration failed: ' + error.message, 'error');
      setLoading(false);
    } else {
      setSuccess(true);
      showToast('Registration successful! Waiting for admin approval.', 'success');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-base-100">
        <Header
          isPlaying={isPlaying}
          volume={volume}
          toggleMusic={toggleMusic}
          setVolume={setVolume}
        />
        <Navigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-2 sm:px-4 py-4">
          <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body text-center p-4 sm:p-6">
            <div className="text-4xl sm:text-6xl mb-4">✅</div>
            <h2 className="card-title text-xl sm:text-2xl justify-center mb-4">Registration Successful!</h2>
            <p className="text-sm sm:text-base mb-4">
              Your registration request has been submitted. An admin will review and approve your account.
              You'll be able to sign in once approved.
            </p>
            <Link to="/login" className="btn btn-sm sm:btn-md btn-primary w-full sm:w-auto">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Header
        isPlaying={isPlaying}
        volume={volume}
        toggleMusic={toggleMusic}
        setVolume={setVolume}
      />
      <Navigation />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-2 sm:px-4 py-4">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body p-4 sm:p-6">
          <h2 className="card-title text-2xl sm:text-3xl mb-4 justify-center">🎁 Join the Family!</h2>
          
          {error && (
            <div className="alert alert-error mb-4 text-sm sm:text-base">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend text-sm sm:text-base">Email</legend>
              <input
                type="email"
                placeholder="your@email.com"
                className="input input-sm sm:input-md w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </fieldset>

            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend text-sm sm:text-base">Which family member are you?</legend>
              <select
                className="select select-sm sm:select-md w-full"
                value={requestedName}
                onChange={(e) => setRequestedName(e.target.value)}
                required
              >
                <option value="">Select your name</option>
                {availableNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              {availableNames.length === 0 && (
                <p className="label text-warning text-xs sm:text-sm">
                  No available profiles. Contact admin.
                </p>
              )}
            </fieldset>

            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend text-sm sm:text-base">Password</legend>
              <input
                type="password"
                placeholder="At least 6 characters"
                className="input input-sm sm:input-md w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </fieldset>

            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend text-sm sm:text-base">Confirm Password</legend>
              <input
                type="password"
                placeholder="Confirm password"
                className="input input-sm sm:input-md w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </fieldset>

            <div className="mt-4 sm:mt-6">
              <button
                type="submit"
                className={`btn btn-sm sm:btn-md btn-primary w-full ${loading ? 'loading' : ''}`}
                disabled={loading || availableNames.length === 0}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <div className="mt-3 sm:mt-4 text-center">
            <p className="text-xs sm:text-sm">
              Already have an account?{' '}
              <Link to="/login" className="link link-primary">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;

