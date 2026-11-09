import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { CreditCard, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function formatCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

function formatCardNumber(value: string) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();
}

export default function CheckoutPage() {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [card, setCard] = useState({
    holderName: '',
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    brand: 'Visa',
  });

  const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCard((c) => ({ ...c, number: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (items.length === 0) {
      setError('Seu carrinho está vazio.');
      return;
    }

    if (!user?.address?.id) {
      setError('Endereço não encontrado. Atualize seu perfil.');
      return;
    }

    const rawNumber = card.number.replace(/\s/g, '');

    if (rawNumber.length !== 16) {
      setError('Número do cartão deve ter 16 dígitos.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/orders/checkout', {
        addressId: user.address.id,
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        card: {
          holderName: card.holderName,
          number: rawNumber,
          expiryMonth: card.expiryMonth,
          expiryYear: card.expiryYear,
          cvv: card.cvv,
          brand: card.brand,
        },
      });

      clearCart();
      toast.success('Pedido realizado com sucesso!');
      navigate(`/orders/${data.order.id}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Erro ao processar pedido.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Seu carrinho está vazio.</p>
        <Link to="/products" className="btn-primary mt-4 inline-block">Ver produtos</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar Compra</h1>

      {/* Banner acadêmico */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 flex items-start gap-2">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <strong>Ambiente Acadêmico de Simulação</strong> — Nenhuma cobrança real é realizada.
          Use dados de cartão fictícios. CVV nunca é armazenado.
          Cartões terminados em <strong>0000</strong> simulam pagamento recusado.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário de pagamento */}
        <div>
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-900">Dados do Cartão (Fictício)</h2>
            </div>

            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-4 text-sm text-green-800">
              <Shield className="w-4 h-4 shrink-0" />
              <span>CVV nunca é armazenado. Número completo não é persistido no banco.</span>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome no cartão</label>
                <input
                  type="text"
                  value={card.holderName}
                  onChange={(e) => setCard((c) => ({ ...c, holderName: e.target.value }))}
                  className="input-field"
                  placeholder="JOÃO DA SILVA"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bandeira</label>
                <select
                  value={card.brand}
                  onChange={(e) => setCard((c) => ({ ...c, brand: e.target.value }))}
                  className="input-field"
                >
                  <option>Visa</option>
                  <option>Mastercard</option>
                  <option>Amex</option>
                  <option>Elo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número do cartão <span className="text-xs text-gray-400">(fictício, 16 dígitos)</span>
                </label>
                <input
                  type="text"
                  value={card.number}
                  onChange={handleCardNumber}
                  className="input-field font-mono tracking-widest"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Termine em 0000 para simular recusa de pagamento</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mês</label>
                  <select
                    value={card.expiryMonth}
                    onChange={(e) => setCard((c) => ({ ...c, expiryMonth: e.target.value }))}
                    className="input-field"
                    required
                  >
                    <option value="">MM</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={String(m).padStart(2, '0')}>
                        {String(m).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                  <select
                    value={card.expiryYear}
                    onChange={(e) => setCard((c) => ({ ...c, expiryYear: e.target.value }))}
                    className="input-field"
                    required
                  >
                    <option value="">AAAA</option>
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((y) => (
                      <option key={y} value={String(y)}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    value={card.cvv}
                    onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    className="input-field font-mono"
                    placeholder="000"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              {/* Endereço de entrega */}
              {user?.address && (
                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                  <p className="font-medium mb-1">📍 Endereço de entrega:</p>
                  <p>{user.address.street}, {user.address.number} {user.address.complement}</p>
                  <p>{user.address.neighborhood} — {user.address.city}/{user.address.state}</p>
                  <p>CEP: {user.address.cep}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Confirmar Pedido — {formatCurrency(total)}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Resumo do pedido */}
        <div>
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Resumo do Pedido</h2>
            <div className="space-y-3 mb-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3">
                  <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">Qtd: {quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    {formatCurrency(Number(product.price) * quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Frete</span>
                <span>{shipping === 0 ? 'Grátis' : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between font-bold text-indigo-600 text-lg">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

