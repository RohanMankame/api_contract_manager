import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import ProductsPage from './pages/ProductsPage';
import ContractsPage from './pages/ContractsPage';
import MainLayout from './layouts/MainLayout';
import './App.css';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('authToken');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route: no layout, no sidebar */}
        <Route path="/login" element={<LoginPage />} />

        {/* All protected routes share MainLayout */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <PrivateRoute>
              <MainLayout>
                <ClientsPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <MainLayout>
                <ProductsPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/contracts"
          element={
            <PrivateRoute>
              <MainLayout>
                <ContractsPage />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Default redirect into a protected+layout route */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" />}
        />
      </Routes>
    </Router>
  );
}

export default App;