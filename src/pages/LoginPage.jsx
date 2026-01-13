import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login(email, password);
      
      console.log('Login response:', response); // Debug log
      
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('authToken', response.data.data.token);
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      
      // err.response?.data?.message is the correct error message
      const errorMsg = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        'Error occoured';
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="card">
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)' }} className="text-center text-neutral-900 mb-2">
            Sign in
          </h2>
          <p className="text-center text-secondary mb-8">
            API contract management portal
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="label" style={{ textAlign: 'left', marginBottom: 'var(--spacing-sx)' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="input-base w-full"
                placeholder="Enter Email"
              />
            </div>

            <div>
              <label className="label" style={{ textAlign: 'left', marginBottom: 'var(--spacing-sx)' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="input-base w-full"
                placeholder="Enter Password"
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
            Having issues?{' '}
            <a href="#" className="text-primary font-semibold hover:underline">
              Contact admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}