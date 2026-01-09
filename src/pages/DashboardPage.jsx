import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-full px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-full px-4 py-6">
        <div className="bg-white shadow rounded-lg p-8">
          <p className="text-gray-600">Welcome to the dashboard. More features coming soon!</p>
        </div>
      </main>
    </div>
  );
}