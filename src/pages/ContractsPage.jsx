// src/pages/ContractsPage.jsx
import { TopNavbar, Sidebar } from '../components/nav';

export default function ContractsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <Sidebar />
      <div className="ml-20 mt-20 p-8">
        <h1 className="text-3xl font-bold text-gray-900">Contracts</h1>
        <p className="mt-4 text-gray-600">Contracts page content goes here.</p>
      </div>
    </div>
  );
}
