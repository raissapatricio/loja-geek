import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Menu, X, Sparkles, BookOpen } from 'lucide-react';
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
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-black text-xl text-white tracking-wider">
            <span className="p-2 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-lg text-white shadow-md shadow-pink-500/20">
              <BookOpen className="w-5 h-5" />
            </span>
            <span>Manga<span className="text-pink-500">Verse</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-slate-300 hover:text-pink-400 transition-colors font-medium">
              Catálogo Geek
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/orders" className="text-slate-300 hover:text-pink-400 transition-colors font-medium flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  Meus Pedidos
                </Link>

                {isAdmin && (
                  <Link to="/admin" className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    Admin
                  </Link>
                )}

                <Link to="/profile" className="flex items-center gap-1 text-slate-300 hover:text-pink-400 transition-colors">
                  <User className="w-4 h-4" />
                  <span className="max-w-[120px] truncate">{user?.name.split(' ')[0]}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-pink-400 transition-colors font-medium">
                  Entrar
                </Link>
                <Link to="/register" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium shadow-md shadow-purple-500/25 transition-all text-sm">
                  Criar conta
                </Link>
              </>
            )}

            {/* Carrinho */}
            <Link to="/cart" className="relative p-2 text-slate-300 hover:text-pink-400 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md shadow-pink-500/50">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 py-4 space-y-3">
          <Link to="/products" className="block text-slate-200 font-medium hover:text-pink-400" onClick={() => setMenuOpen(false)}>Catálogo Geek</Link>
          <Link to="/cart" className="block text-slate-200 font-medium hover:text-pink-400" onClick={() => setMenuOpen(false)}>
            Carrinho {itemCount > 0 && `(${itemCount})`}
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/orders" className="block text-slate-200 font-medium hover:text-pink-400" onClick={() => setMenuOpen(false)}>Meus Pedidos</Link>
              <Link to="/profile" className="block text-slate-200 font-medium hover:text-pink-400" onClick={() => setMenuOpen(false)}>Meu Perfil</Link>
              {isAdmin && (
                <Link to="/admin" className="block text-purple-400 font-medium" onClick={() => setMenuOpen(false)}>Painel Admin</Link>
              )}
              <button onClick={handleLogout} className="block text-red-400 font-medium text-left">Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-slate-200 font-medium hover:text-pink-400" onClick={() => setMenuOpen(false)}>Entrar</Link>
              <Link to="/register" className="block text-pink-400 font-medium" onClick={() => setMenuOpen(false)}>Criar conta</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

