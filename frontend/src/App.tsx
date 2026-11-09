import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: '0.75rem', fontSize: '0.875rem' },
            }}
          />

          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<><Navbar /><HomePage /></>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<><Navbar /><ProductsPage /></>} />
            <Route path="/products/:id" element={<><Navbar /><ProductDetailPage /></>} />
            <Route path="/cart" element={<><Navbar /><CartPage /></>} />

            {/* Rotas protegidas (usuário autenticado) */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <OrderDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Rotas admin — RBAC: somente administradores */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <Navbar />
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute adminOnly>
                  <Navbar />
                  <AdminProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute adminOnly>
                  <Navbar />
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly>
                  <Navbar />
                  <AdminUsers />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={
              <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <Navbar />
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
                  <p className="text-gray-500">Página não encontrada.</p>
                  <a href="/" className="mt-4 btn-primary inline-block">Voltar ao início</a>
                </div>
              </div>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
