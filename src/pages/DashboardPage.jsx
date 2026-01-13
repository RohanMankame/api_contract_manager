// src/pages/DashboardPage.jsx
import { TopNavbar, Sidebar } from '../components/nav';
import { ProductsIcon, ClientsIcon, ContractsIcon, ArrowIcon } from '../components/icons';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();

  // navigation cards data
  const cards = [
    {
      title: 'Products',
      desc: 'Manage your API products and versions',
      icon: ProductsIcon,
      path: '/products',
    },
    {
      title: 'Clients',
      desc: 'Manage your API clients and integrations',
      icon: ClientsIcon,
      path: '/clients',
    },
    {
      title: 'Contracts',
      desc: 'Manage your API contracts and agreements',
      icon: ContractsIcon,
      path: '/contracts',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <Sidebar />
      <div className="ml-20 mt-20 p-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Dashboard</h1>

        {/* Navigation Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.path}
                onClick={() => navigate(c.path)}
                className="w-full h-40 bg-white border border-gray-200 rounded-lg p-6 text-left hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-50 rounded-md text-green-600 flex items-center justify-center">
                    <Icon />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{c.title}</h2>
                    <p className="mt-2 text-sm text-gray-600">{c.desc}</p>
                  </div>
                </div>

                <div className="text-green-500">
                  <ArrowIcon />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}