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
    <aside className="fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 shadow-sm z-40 transition-all duration-300" 
    style={{ width: isExpanded ? '250px' : '60px' }} 
    onMouseEnter={() => setIsExpanded(true)} 
    onMouseLeave={() => setIsExpanded(false)} 
    >

      <nav className="p-0 m-0 space-y-0">
        {navItems.map((item) => {
            const Icon = item.icon;
            return (
            <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full h-15 relative group flex items-center gap-3 pl-4 pr-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <span className="text-gray-600">
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

