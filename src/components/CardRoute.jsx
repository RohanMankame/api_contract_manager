import { useNavigate } from 'react-router-dom';
import { ArrowIcon } from './icons';

export default function CardRoute({ title, desc, Icon, path }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="group w-full h-40 bg-white border border-gray-200 rounded-lg p-6 text-left hover:shadow-lg hover:border-indigo-500 transition-all duration-200 flex flex-col justify-between cursor-pointer focus:outline-none focus:border-indigo-500"
    >
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50 text-gray-400 transition-all duration-200 group-hover:bg-indigo-50 group-hover:text-indigo-700 group-focus:bg-indigo-50 group-focus:text-indigo-700">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">{desc}</p>
        </div>
      </div>

      <div className="flex items-center text-indigo-600 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200">
        <ArrowIcon className="w-5 h-5" />
      </div>
    </button>
  );
}