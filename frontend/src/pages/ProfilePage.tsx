import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { User, MapPin, Edit3, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    cep: user?.address?.cep || '',
    street: user?.address?.street || '',
    number: user?.address?.number || '',
    complement: user?.address?.complement || '',
    neighborhood: user?.address?.neighborhood || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
  });

  const handleCEPBlur = async (cep: string) => {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm((f) => ({
          ...f,
          street: data.logradouro || f.street,
          neighborhood: data.bairro || f.neighborhood,
          city: data.localidade || f.city,
          state: data.uf || f.state,
        }));
      }
    } catch {}
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/auth/me', {
        name: form.name,
        phone: form.phone,
        address: {
          cep: form.cep,
          street: form.street,
          number: form.number,
          complement: form.complement,
          neighborhood: form.neighborhood,
          city: form.city,
          state: form.state,
        },
      });
      await refreshUser();
      setEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch {
      toast.error('Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Meu Perfil</h1>

      {/* Dados pessoais */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">Dados Pessoais</h2>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="btn-secondary text-sm flex items-center gap-1"
            >
              <Edit3 className="w-4 h-4" /> Editar
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="input-field"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" /> Endereço
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">CEP</label>
                  <input
                    type="text"
                    value={form.cep}
                    onChange={(e) => setForm((f) => ({ ...f, cep: e.target.value }))}
                    onBlur={(e) => handleCEPBlur(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Rua</label>
                  <input type="text" value={form.street} onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Número</label>
                  <input type="text" value={form.number} onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))} className="input-field" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Complemento</label>
                  <input type="text" value={form.complement} onChange={(e) => setForm((f) => ({ ...f, complement: e.target.value }))} className="input-field" />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Bairro</label>
                  <input type="text" value={form.neighborhood} onChange={(e) => setForm((f) => ({ ...f, neighborhood: e.target.value }))} className="input-field" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Cidade</label>
                  <input type="text" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Estado</label>
                  <input type="text" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value.toUpperCase().slice(0, 2) }))} className="input-field" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={loading} className="btn-primary flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
              <button onClick={() => setEditing(false)} className="btn-secondary">Cancelar</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Nome</p>
                <p className="font-medium text-gray-900">{user?.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">CPF</p>
                <p className="font-medium text-gray-900 font-mono">{user?.cpf}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">E-mail</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Telefone</p>
                <p className="font-medium text-gray-900">{user?.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Perfil</p>
                <span className={`badge ${user?.role === 'ADMIN' ? 'badge-blue' : 'badge-gray'}`}>
                  {user?.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
                </span>
              </div>
            </div>

            {user?.address && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-medium text-gray-800">Endereço</h3>
                </div>
                <p className="text-sm text-gray-700">
                  {user.address.street}, {user.address.number}
                  {user.address.complement && ` - ${user.address.complement}`}
                </p>
                <p className="text-sm text-gray-700">
                  {user.address.neighborhood} — {user.address.city}/{user.address.state}
                </p>
                <p className="text-sm text-gray-700">CEP: {user.address.cep}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

