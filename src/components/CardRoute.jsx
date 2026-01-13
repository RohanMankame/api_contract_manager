// src/components/CardRoute.jsx
import { useNavigate } from 'react-router-dom';
import { ArrowIcon } from './icons';
import '../styles/components/cardroute.css';

export default function CardRoute({ title, desc, Icon, path }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="group w-full h-40 bg-white border border-gray-200 rounded-lg p-6 text-left hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between"
    >
      <div className="flex items-start gap-4">
        <div className="card-icon">
          <Icon />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">{desc}</p>
        </div>
      </div>

      <div className="card-arrow">
        <ArrowIcon />
      </div>
    </button>
  );
}