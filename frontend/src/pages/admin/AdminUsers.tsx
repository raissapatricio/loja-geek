import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users, UserCheck, UserX } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserAdmin {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  role: string;
  active: boolean;
  createdAt: string;
  _count: { orders: number };
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    api.get('/admin/users').then(({ data }) => setUsers(data)).finally(() => setLoading(false));
  }, []);

  const toggleUser = async (id: string) => {
    setToggling(id);
    try {
      await api.patch(`/admin/users/${id}/toggle`);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
      );
      toast.success('Status do usuário atualizado!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Erro ao atualizar.';
      toast.error(msg);
    } finally {
      setToggling(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Carregando usuários...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-green-600" />
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
        <span className="ml-auto badge-gray">{users.length} usuários</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nome</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">CPF (mascarado)</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">E-mail</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Perfil</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Pedidos</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{user.cpf}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${user.role === 'ADMIN' ? 'badge-blue' : 'badge-gray'}`}>
                      {user.role === 'ADMIN' ? 'Admin' : 'Usuário'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">{user._count.orders}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${user.active ? 'badge-green' : 'badge-red'}`}>
                      {user.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleUser(user.id)}
                      disabled={toggling === user.id}
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors ${
                        user.active
                          ? 'border-red-300 text-red-600 hover:bg-red-50'
                          : 'border-green-300 text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {user.active ? <UserX className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                      {user.active ? 'Desativar' : 'Ativar'}
                    </button>
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

