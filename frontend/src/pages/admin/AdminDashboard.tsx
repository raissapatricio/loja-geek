import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import type { Order, Product } from '../../types';
import { OrderStatusBadge, formatCurrency } from '../../components/ui/StatusBadge';
import { Package, Users, ShoppingBag, TrendingUp, Shield } from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/orders'),
      api.get('/admin/products'),
      api.get('/admin/users'),
    ]).then(([ordersRes, productsRes, usersRes]) => {
      setOrders(ordersRes.data);
      setProducts(productsRes.data.data || productsRes.data);
      setUserCount(usersRes.data.length);
    }).finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'APPROVED')
    .reduce((sum, o) => sum + Number(o.total), 0);

  if (loading) {
    return <div className="p-8 animate-pulse"><div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="text-sm text-gray-500">Acesso restrito — Administradores</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total de Pedidos', value: orders.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Usuários Cadastrados', value: userCount, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Produtos Ativos', value: products.length, icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Receita Total', value: formatCurrency(totalRevenue), icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`${stat.bg} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link to="/admin/products" className="card hover:shadow-md transition-shadow flex items-center gap-3">
          <ShoppingBag className="w-6 h-6 text-orange-600" />
          <div>
            <p className="font-semibold text-gray-900">Gerenciar Produtos</p>
            <p className="text-sm text-gray-500">Criar, editar, desativar</p>
          </div>
        </Link>
        <Link to="/admin/orders" className="card hover:shadow-md transition-shadow flex items-center gap-3">
          <Package className="w-6 h-6 text-blue-600" />
          <div>
            <p className="font-semibold text-gray-900">Gerenciar Pedidos</p>
            <p className="text-sm text-gray-500">Visualizar e atualizar status</p>
          </div>
        </Link>
        <Link to="/admin/users" className="card hover:shadow-md transition-shadow flex items-center gap-3">
          <Users className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-semibold text-gray-900">Gerenciar Usuários</p>
            <p className="text-sm text-gray-500">Visualizar e controlar acesso</p>
          </div>
        </Link>
      </div>

      {/* Pedidos recentes */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pedidos Recentes</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Cliente</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Total</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-4 py-3 text-gray-900">{order.user?.name || '—'}</td>
                  <td className="px-4 py-3 font-semibold text-indigo-600">{formatCurrency(Number(order.total))}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={order.orderStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

