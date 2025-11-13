import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Navigation from '../Navigation';
import { useToast } from '../Toast';

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
        <Navigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
          <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="card-title text-2xl justify-center mb-4">Registration Successful!</h2>
            <p className="mb-4">
              Your registration request has been submitted. An admin will review and approve your account.
              You'll be able to sign in once approved.
            </p>
            <Link to="/login" className="btn btn-primary">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Navigation />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-4 justify-center">🎁 Join the Family!</h2>
          
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Which family member are you?</span>
              </label>
              <select
                className="select select-bordered"
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
                <label className="label">
                  <span className="label-text-alt text-warning">
                    No available profiles. Contact admin.
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                className="input input-bordered"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading || availableNames.length === 0}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm">
              Already have an account?{' '}
              <Link to="/login" className="link link-primary">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Register;

