import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

function formatCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, shipping, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Carrinho vazio</h1>
        <p className="text-gray-500 mb-6">Adicione produtos para continuar.</p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
          Ver produtos <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Carrinho de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Itens */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=Produto'; }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                <p className="text-xs text-indigo-600 mb-2">{product.category}</p>
                <p className="text-sm font-bold text-gray-700">
                  {formatCurrency(Number(product.price))} cada
                </p>
                <p className="text-xs text-gray-500">Estoque: {product.stock}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <button
                  onClick={() => removeItem(product.id)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-sm font-bold text-indigo-600">
                  {formatCurrency(Number(product.price) * quantity)}
                </p>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" /> Limpar carrinho
          </button>
        </div>

        {/* Resumo */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Resumo do pedido</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Frete</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'Grátis' : formatCurrency(shipping)}
                </span>
              </div>
              {shipping === 0 && subtotal > 0 && (
                <p className="text-xs text-green-600">🎉 Frete grátis em compras acima de R$ 299</p>
              )}
              {shipping > 0 && (
                <p className="text-xs text-gray-500">
                  Frete grátis a partir de {formatCurrency(299 - subtotal)} a mais
                </p>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span className="text-indigo-600">{formatCurrency(total)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="btn-primary w-full text-center flex items-center justify-center gap-2"
            >
              Finalizar compra <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/products"
              className="btn-secondary w-full text-center mt-3 flex items-center justify-center"
            >
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

