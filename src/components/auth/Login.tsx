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

          <div className="mt-3 sm:mt-4 text-center">
            <p className="text-xs sm:text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="link link-primary">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;

