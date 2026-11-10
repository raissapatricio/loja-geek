import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import type { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, ChevronLeft, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

function formatCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => toast.error('Produto não encontrado.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock === 0) {
      toast.error('Produto esgotado.');
      return;
    }
    addItem(product, quantity);
    toast.success(`${quantity}x ${product.name} adicionado(s) ao carrinho!`);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-24 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-gray-200 rounded-xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Produto não encontrado</h2>
        <p className="text-gray-500 mb-6">O item que você procura pode ter sido removido ou desativado.</p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Voltar ao catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-6">
        <ChevronLeft className="w-4 h-4" /> Voltar para produtos
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200">
        <div>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-96 object-cover rounded-xl border border-gray-100 shadow-inner"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Produto';
            }}
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="badge-blue text-xs uppercase tracking-wide font-semibold mb-2 inline-block">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
            <p className="text-gray-600 mb-6 leading-relaxed whitespace-pre-line">{product.description}</p>

            <div className="mb-6">
              <span className="text-3xl font-extrabold text-indigo-600">
                {formatCurrency(Number(product.price))}
              </span>
              <p className="text-sm mt-1">
                {product.stock > 0 ? (
                  <span className="text-emerald-700 font-medium">✓ Em estoque ({product.stock} disponíveis)</span>
                ) : (
                  <span className="text-rose-600 font-medium">✕ Produto esgotado</span>
                )}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Quantidade:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {product.stock === 0 ? 'Indisponível' : 'Adicionar ao Carrinho'}
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs text-gray-500 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Frete Grátis acima de R$ 299</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Compra 100% Protegida</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Garantia de 30 Dias</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

