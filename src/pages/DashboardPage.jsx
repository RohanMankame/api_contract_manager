import { TopNavbar, Sidebar } from '../components/nav';
import CardRoute from '../components/CardRoute';
import { ProductsIcon, ClientsIcon, ContractsIcon } from '../components/icons';

export default function DashboardPage() {
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
    <div className="min-h-screen bg-gray-50 pl-6">
      <TopNavbar />
      <Sidebar />

      <div className="mt-16 text-left ">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Dashboard</h1>
          <p>Welcome to your dashboard. Use the cards below to navigate through different sections.</p>
        </div>

        {/* Navigation Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 flex-3">
          {cards.map((c) => {
            const Icon = c.icon;
            return <CardRoute key={c.path} title={c.title} desc={c.desc} Icon={Icon} path={c.path} />;
          })}
        </div>
      </div>
    </div>
  );
}