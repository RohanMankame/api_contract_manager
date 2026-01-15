import TopNavbar from '../components/nav/TopNavbar';
import Sidebar from '../components/nav/Sidebar';

export default function MainLayout({ children }) {
  // Width of the sidebar when it is closed (collapsed)
  const COLLAPSED_SIDEBAR_WIDTH = '3.5rem';

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <Sidebar />

      {/* Main content is pushed right by the sidebar width and below the navbar */}
      <main
        className="pt-16"
        style={{ marginLeft: COLLAPSED_SIDEBAR_WIDTH }}
      >
        {/* This centers your "page" in the remaining space */}
        <div className="w-full px-6">
          {children}
        </div>
      </main>
    </div>
  );
}