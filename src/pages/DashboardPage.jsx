import CardRoute from '../components/CardRoute';
import { ProductsIcon, ClientsIcon, ContractsIcon } from '../components/icons';

const cards = [
  { title: 'Clients', desc: 'Manage your clients', icon: ClientsIcon, path: '/clients' },
  { title: 'Products', desc: 'Manage your products', icon: ProductsIcon, path: '/products' },
  { title: 'Contracts', desc: 'Manage your contracts', icon: ContractsIcon, path: '/contracts' },
];

export default function DashboardPage() {

  return (
    <div className="mt-4 text-left">
      <div>
        <h1 className="text-xl font-medium text-gray-900">Dashboard</h1>
        <p>
          Welcome to your dashboard. Use the cards below to navigate through different
          sections.
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 flex-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <CardRoute
              key={c.path}
              title={c.title}
              desc={c.desc}
              Icon={Icon}
              path={c.path}
            />
          );
        })}
      </div>
    </div>
  );
}