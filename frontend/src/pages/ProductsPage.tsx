import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Product, PaginatedProducts } from '../types';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

function formatCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

export default function ProductsPage() {
  const { addItem } = useCart();
  const [data, setData] = useState<PaginatedProducts | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 12 };
      if (search) params.search = search;
      if (category) params.category = category;
      const { data: res } = await api.get('/products', { params });
      setData(res);
    } catch {
      toast.error('Erro ao carregar produtos.');
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    api.get('/products/categories').then(({ data }) => setCategories(data));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      toast.error('Produto sem estoque.');
      return;
    }
    addItem(product);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Produtos</h1>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produtos..."
              className="input-field pl-9"
            />
          </div>
          <button type="submit" className="btn-primary">Buscar</button>
        </form>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="input-field w-auto"
          >
            <option value="">Todas as categorias</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de produtos */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-xl"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {data?.data.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg">Nenhum produto encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.data.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col">
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-48 w-full object-cover rounded-t-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Produto';
                      }}
                    />
                  </Link>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-xs text-indigo-600 font-medium mb-1">{product.category}</span>
                    <Link to={`/products/${product.id}`} className="font-semibold text-gray-900 hover:text-indigo-600 mb-1 line-clamp-2">
                      {product.name}
                    </Link>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">{product.description}</p>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-bold text-indigo-600">
                        {formatCurrency(Number(product.price))}
                      </span>
                      {product.stock === 0 ? (
                        <span className="badge-red text-xs">Sem estoque</span>
                      ) : (
                        <span className="text-xs text-gray-500">{product.stock} em estoque</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="btn-primary w-full mt-3 text-sm flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {product.stock === 0 ? 'Sem estoque' : 'Adicionar ao carrinho'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginação */}
          {data && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary flex items-center gap-1 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
              <span className="text-sm text-gray-600">
                Página {page} de {data.pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page === data.pagination.totalPages}
                className="btn-secondary flex items-center gap-1 disabled:opacity-40"
              >
                Próxima
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

