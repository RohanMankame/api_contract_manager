// src/components/nav/Sidebar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardIcon, ClientsIcon, ProductsIcon, ContractsIcon } from '../icons/index.jsx';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
    { name: 'Clients', path: '/clients', icon: ClientsIcon },
    { name: 'Products', path: '/products', icon: ProductsIcon },
    { name: 'Contracts', path: '/contracts', icon: ContractsIcon },
  ];

  return (
    <aside
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-sm z-40 transition-all duration-300"
      style={{ width: isExpanded ? '250px' : '80px' }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <nav className="p-4 space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <span className="text-gray-600 flex-shrink-0">
                <Icon />
              </span>
              <span
                className="text-sm font-medium whitespace-nowrap transition-opacity duration-300"
                style={{ opacity: isExpanded ? 1 : 0 }}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

