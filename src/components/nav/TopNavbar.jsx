// src/components/nav/TopNavbar.jsx
import { useNavigate } from 'react-router-dom';

export default function TopNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm z-50">
      <h1 className="text-2xl font-semibold text-gray-900">API Contract Manager</h1>
      <button
        onClick={handleLogout}
        className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors duration-200"
      >
        Logout
      </button>
    </nav>
  );
}
