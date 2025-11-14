import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from '../Navigation';
import { useToast } from '../Toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
      showToast('Login failed: ' + error.message, 'error');
      setLoading(false);
    } else {
      showToast('Welcome back!', 'success');
      navigate('/wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Navigation />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-2 sm:px-4 py-4">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body p-4 sm:p-6">
          <h2 className="card-title text-2xl sm:text-3xl mb-4 justify-center">🎁 Welcome Back!</h2>
          
          {/* Registration Required Notice */}
          <div className="alert alert-info shadow-lg mb-4 border-2 border-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className="flex-1">
              <h3 className="font-bold text-sm sm:text-base mb-1">⚠️ Registration Required</h3>
              <div className="text-xs sm:text-sm">
                <p className="mb-1">
                  You must{' '}
                  <Link to="/register" className="link link-primary font-bold underline text-base-content hover:text-primary">
                    register first
                  </Link>
                  {' '}before you can log in.
                </p>
                <p>After registration, an admin will approve your account before you can sign in.</p>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="form-control">
              <label className="label py-1 sm:py-2">
                <span className="label-text text-sm sm:text-base">Email</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="input input-bordered input-sm sm:input-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label py-1 sm:py-2">
                <span className="label-text text-sm sm:text-base">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered input-sm sm:input-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-control mt-4 sm:mt-6">
              <button
                type="submit"
                className={`btn btn-sm sm:btn-md btn-primary w-full ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-3 sm:mt-4">
            <div className="divider text-xs sm:text-sm">OR</div>
            <div className="text-center">
              <p className="text-xs sm:text-sm mb-2 font-semibold">
                Need to create an account?
              </p>
              <Link to="/register" className="btn btn-outline btn-primary btn-sm sm:btn-md w-full">
                <span className="text-base">📝</span>
                <span>Register Now</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;

