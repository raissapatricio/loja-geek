import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Product, PaginatedProducts } from '../types';
import { useCart } from '../contexts/CartContext';
import {
  ShoppingCart,
  Search,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  PackageX,
  Flame,
} from 'lucide-react';
import toast from 'react-hot-toast';

function formatCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

// Imagem de reserva no mesmo estilo da loja (usada quando a imagem do produto não carrega)
const FALLBACK_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#312e81"/>
          <stop offset="1" stop-color="#831843"/>
        </linearGradient>
      </defs>
      <rect width="600" height="800" fill="url(#g)"/>
      <text x="300" y="410" font-family="sans-serif" font-size="34" font-weight="700"
            fill="#f9a8d4" text-anchor="middle">MangaVerse</text>
    </svg>`
  );

export default function ProductsPage() {
  const { addItem } = useCart();
  const [data, setData] = useState<PaginatedProducts | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
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
    setSearch(searchInput.trim());
  };

  const handleCategory = (c: string) => {
    setCategory(c);
    setPage(1);
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      toast.error('Produto esgotado.');
      return;
    }
    addItem(product);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-pink-500 selection:text-white">
      {/* Cabeçalho */}
      <section className="border-b border-slate-800 bg-[radial-gradient(ellipse_80%_100%_at_50%_-30%,rgba(120,119,198,0.25),rgba(255,255,255,0))] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-400">
            <BookOpen className="h-4 w-4" /> Catálogo Geek
          </div>
          <h1 className="mb-2 text-3xl font-black tracking-tight sm:text-5xl">
            Mangás, <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Figures</span> e mais
          </h1>
          <p className="max-w-2xl text-slate-400">
            Escolha o próximo volume da sua estante ou aquele colecionável que está faltando.
          </p>

          {/* Busca */}
          <form onSubmit={handleSearch} className="mt-8 flex max-w-2xl gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar por título, série ou personagem..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:from-pink-600 hover:to-purple-700"
            >
              Buscar
            </button>
          </form>

          {/* Categorias */}
          <div className="mt-6 flex flex-wrap gap-2">
            {['', ...categories].map((c) => {
              const active = category === c;
              return (
                <button
                  key={c || 'todas'}
                  onClick={() => handleCategory(c)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                    active
                      ? 'border-pink-500 bg-pink-500/15 text-pink-300'
                      : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-purple-500/60 hover:text-white'
                  }`}
                >
                  {c || 'Todos'}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Grid de produtos */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                <div className="aspect-[3/4] bg-slate-800" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded bg-slate-800" />
                  <div className="h-3 rounded bg-slate-800" />
                  <div className="h-6 w-1/3 rounded bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {data?.data.length === 0 ? (
              <div className="py-20 text-center text-slate-400">
                <PackageX className="mx-auto mb-3 h-12 w-12 text-slate-600" />
                <p className="text-lg font-semibold text-slate-200">Nada por aqui ainda.</p>
                <p className="text-sm">Tente outro nome ou volte para todas as categorias.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data?.data.map((product) => {
                  const soldOut = product.stock === 0;
                  const lowStock = product.stock > 0 && product.stock <= 5;
                  return (
                    <div
                      key={product.id}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/50 hover:shadow-xl hover:shadow-purple-950/60"
                    >
                      <Link to={`/products/${product.id}`} className="relative block aspect-[3/4] overflow-hidden bg-slate-800">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          loading="lazy"
                          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${soldOut ? 'opacity-50 grayscale' : ''}`}
                          onError={(e) => {
                            const img = e.currentTarget;
                            img.onerror = null;
                            img.src = FALLBACK_IMG;
                          }}
                        />
                        <span className="absolute left-3 top-3 rounded-full border border-purple-500/40 bg-slate-950/80 px-2.5 py-1 text-xs font-semibold text-purple-300 backdrop-blur-sm">
                          {product.category}
                        </span>
                        {soldOut && (
                          <span className="absolute right-3 top-3 rounded-full border border-red-500/40 bg-red-500/20 px-2.5 py-1 text-xs font-semibold text-red-300 backdrop-blur-sm">
                            Esgotado
                          </span>
                        )}
                        {lowStock && (
                          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-orange-500/40 bg-orange-500/20 px-2.5 py-1 text-xs font-semibold text-orange-300 backdrop-blur-sm">
                            <Flame className="h-3 w-3" /> Últimas unidades
                          </span>
                        )}
                      </Link>

                      <div className="flex flex-1 flex-col p-4">
                        <Link
                          to={`/products/${product.id}`}
                          className="mb-1 line-clamp-2 font-bold text-white transition-colors hover:text-pink-300"
                        >
                          {product.name}
                        </Link>
                        <p className="mb-4 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-400">
                          {product.description}
                        </p>

                        <span className="mb-3 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-2xl font-black text-transparent">
                          {formatCurrency(Number(product.price))}
                        </span>

                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={soldOut}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-purple-500/20 transition-all hover:from-pink-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 disabled:shadow-none"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          {soldOut ? 'Esgotado' : 'Adicionar ao carrinho'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Paginação */}
            {data && data.pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-pink-500/50 disabled:opacity-40 disabled:hover:border-slate-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </button>
                <span className="text-sm text-slate-400">
                  Página {page} de {data.pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                  disabled={page === data.pagination.totalPages}
                  className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-pink-500/50 disabled:opacity-40 disabled:hover:border-slate-700"
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
