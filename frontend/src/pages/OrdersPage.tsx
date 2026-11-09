import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Order } from '../types';
import { OrderStatusBadge, PaymentStatusBadge, formatCurrency, formatDate } from '../components/ui/StatusBadge';
import { Package, ArrowRight } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Meus Pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 mb-4">Você ainda não fez nenhum pedido.</p>
          <Link to="/products" className="btn-primary">Ver produtos</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-500 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <OrderStatusBadge status={order.orderStatus} />
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-2 text-sm">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <span className="text-gray-700 max-w-[150px] truncate">{item.product.name}</span>
                    <span className="text-gray-400">×{item.quantity}</span>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <span className="text-xs text-gray-400 self-center">+{order.items.length - 3} mais</span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  {order.trackingCode && (
                    <p className="text-xs text-gray-500 font-mono">
                      Rastreio: <span className="text-indigo-600 font-medium">{order.trackingCode}</span>
                    </p>
                  )}
                  <p className="text-lg font-bold text-indigo-600">{formatCurrency(Number(order.total))}</p>
                </div>
                <Link
                  to={`/orders/${order.id}`}
                  className="btn-secondary text-sm flex items-center gap-1"
                >
                  Detalhes <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

