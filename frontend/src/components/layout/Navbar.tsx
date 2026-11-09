import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Shield, Package, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <Shield className="w-6 h-6" />
            <span>SecureCommerce</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              Produtos
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/orders" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  Pedidos
                </Link>

                {isAdmin && (
                  <Link to="/admin" className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}

                <Link to="/profile" className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition-colors">
                  <User className="w-4 h-4" />
                  <span className="max-w-[120px] truncate">{user?.name.split(' ')[0]}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                  Entrar
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Criar conta
                </Link>
              </>
            )}

            {/* Carrinho */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3">
          <Link to="/products" className="block text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Produtos</Link>
          <Link to="/cart" className="block text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
            Carrinho {itemCount > 0 && `(${itemCount})`}
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/orders" className="block text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Meus Pedidos</Link>
              <Link to="/profile" className="block text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Meu Perfil</Link>
              {isAdmin && (
                <Link to="/admin" className="block text-purple-600 font-medium" onClick={() => setMenuOpen(false)}>Painel Admin</Link>
              )}
              <button onClick={handleLogout} className="block text-red-600 font-medium text-left">Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Entrar</Link>
              <Link to="/register" className="block text-indigo-600 font-medium" onClick={() => setMenuOpen(false)}>Criar conta</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

