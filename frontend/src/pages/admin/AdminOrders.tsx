import { useEffect, useState } from 'react';
import api from '../../services/api';
import type { Order, OrderStatus } from '../../types';
import { OrderStatusBadge, PaymentStatusBadge, formatCurrency, formatDate } from '../../components/ui/StatusBadge';
import { Package } from 'lucide-react';
import toast from 'react-hot-toast';

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'PLACED', label: 'Pedido realizado' },
  { value: 'PAYMENT_APPROVED', label: 'Pagamento aprovado' },
  { value: 'PREPARING', label: 'Preparando pedido' },
  { value: 'SHIPPED', label: 'Enviado' },
  { value: 'IN_TRANSIT', label: 'Em trânsito' },
  { value: 'DELIVERED', label: 'Entregue' },
  { value: 'CANCELLED', label: 'Cancelado' },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    api.get('/admin/orders').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId: string, orderStatus: OrderStatus) => {
    setUpdating(orderId);
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { orderStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus } : o))
      );
      toast.success('Status atualizado!');
    } catch {
      toast.error('Erro ao atualizar status.');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Carregando pedidos...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Pedidos</h1>
        <span className="ml-auto badge-gray">{orders.length} pedidos</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Cliente</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Data</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Total</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Pagamento</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{order.user?.name}</p>
                    <p className="text-xs text-gray-500">{order.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3 font-semibold text-indigo-600">{formatCurrency(Number(order.total))}</td>
                  <td className="px-4 py-3"><PaymentStatusBadge status={order.paymentStatus} /></td>
                  <td className="px-4 py-3"><OrderStatusBadge status={order.orderStatus} /></td>
                  <td className="px-4 py-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                      disabled={updating === order.id}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {statusOptions.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

