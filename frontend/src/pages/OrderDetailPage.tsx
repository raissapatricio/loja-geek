import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import type { Order, OrderStatus } from '../types';
import { OrderStatusBadge, PaymentStatusBadge, formatCurrency, formatDate } from '../components/ui/StatusBadge';
import { MapPin, Package, CreditCard, Truck, ChevronLeft } from 'lucide-react';

const statusSteps: OrderStatus[] = [
  'PLACED', 'PAYMENT_APPROVED', 'PREPARING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED',
];

const statusLabels: Record<OrderStatus, string> = {
  PLACED: 'Pedido realizado',
  PAYMENT_APPROVED: 'Pagamento aprovado',
  PREPARING: 'Preparando',
  SHIPPED: 'Enviado',
  IN_TRANSIT: 'Em trânsito',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(() => setError('Pedido não encontrado.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="bg-white rounded-xl border h-48"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">{error || 'Pedido não encontrado.'}</p>
        <Link to="/orders" className="btn-primary">Meus pedidos</Link>
      </div>
    );
  }

  const currentStepIndex = order.orderStatus === 'CANCELLED'
    ? -1
    : statusSteps.indexOf(order.orderStatus);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/orders" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ChevronLeft className="w-4 h-4" /> Voltar aos pedidos
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedido #{order.id.slice(0, 8).toUpperCase()}</h1>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          <OrderStatusBadge status={order.orderStatus} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      {/* Timeline de status */}
      {order.orderStatus !== 'CANCELLED' && (
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-gray-900">Acompanhamento da Entrega</h2>
          </div>

          {order.trackingCode && (
            <p className="text-sm mb-4 text-gray-600">
              Código de rastreio: <span className="font-mono font-bold text-indigo-600">{order.trackingCode}</span>
            </p>
          )}

          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="space-y-4">
              {statusSteps.map((step, index) => {
                const done = index <= currentStepIndex;
                const current = index === currentStepIndex;
                return (
                  <div key={step} className="relative flex items-center gap-4 pl-8">
                    <div className={`absolute left-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      done
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-gray-300'
                    }`}>
                      {done && <span className="text-xs">✓</span>}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${done ? 'text-gray-900' : 'text-gray-400'}`}>
                        {statusLabels[step]}
                        {current && <span className="ml-2 badge-blue">Atual</span>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Produtos */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-indigo-600" />
          <h2 className="font-bold text-gray-900">Itens do Pedido</h2>
        </div>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <img src={item.product.imageUrl} alt={item.product.name} className="w-14 h-14 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.product.name}</p>
                <p className="text-sm text-gray-500">Qtd: {item.quantity} × {formatCurrency(Number(item.unitPrice))}</p>
              </div>
              <p className="font-semibold text-gray-900">{formatCurrency(Number(item.unitPrice) * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 mt-4 pt-3 space-y-1">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span><span>{formatCurrency(Number(order.subtotal))}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Frete</span>
            <span>{Number(order.shipping) === 0 ? 'Grátis' : formatCurrency(Number(order.shipping))}</span>
          </div>
          <div className="flex justify-between font-bold text-indigo-600 text-lg">
            <span>Total</span><span>{formatCurrency(Number(order.total))}</span>
          </div>
        </div>
      </div>

      {/* Pagamento e endereço */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {order.cardInfo && (
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-gray-900">Pagamento</h2>
            </div>
            <p className="text-sm text-gray-600">{order.cardInfo.brand}</p>
            <p className="text-sm text-gray-600 font-mono">•••• •••• •••• {order.cardInfo.lastFour}</p>
            <p className="text-xs text-gray-400 mt-2">CVV nunca armazenado · Número completo não persistido</p>
          </div>
        )}

        {order.address && (
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-gray-900">Entrega</h2>
            </div>
            <p className="text-sm text-gray-700">{order.address.street}, {order.address.number}</p>
            {order.address.complement && (
              <p className="text-sm text-gray-700">{order.address.complement}</p>
            )}
            <p className="text-sm text-gray-700">{order.address.neighborhood}</p>
            <p className="text-sm text-gray-700">{order.address.city}/{order.address.state}</p>
            <p className="text-sm text-gray-700">CEP: {order.address.cep}</p>
          </div>
        )}
      </div>
    </div>
  );
}

