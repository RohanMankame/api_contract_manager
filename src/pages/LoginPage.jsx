import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';
import { useUser } from '../context/UserContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { refreshUser } = useUser();
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

      if (response.data.success && response.data.data.token) {
        localStorage.setItem('authToken', response.data.data.token);
        await refreshUser();
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Error occurred';

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500">
              API contract management portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-sm disabled:bg-gray-50 disabled:cursor-not-allowed outline-none"
                placeholder="Enter Email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-sm disabled:bg-gray-50 disabled:cursor-not-allowed outline-none"
                placeholder="Enter Password"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-100 animate-in fade-in slide-in-from-top-1 duration-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center items-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Having issues?{' '}
            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors duration-200">
              Contact admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}