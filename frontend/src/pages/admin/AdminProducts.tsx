import { useEffect, useState } from 'react';
import api from '../../services/api';
import type { Product } from '../../types';
import { ShoppingBag, Plus, Edit3, Trash2, X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function formatCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

const emptyProduct = {
  name: '',
  description: '',
  imageUrl: '',
  category: '',
  price: 0,
  stock: 0,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await api.get('/admin/products');
    setProducts(data.data || data);
    setLoading(false);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProduct);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      category: product.category,
      price: Number(product.price),
      stock: product.stock,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.description || !form.imageUrl || !form.category) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/admin/products/${editing.id}`, form);
        toast.success('Produto atualizado!');
      } else {
        await api.post('/admin/products', form);
        toast.success('Produto criado!');
      }
      setModalOpen(false);
      await fetchProducts();
    } catch {
      toast.error('Erro ao salvar produto.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm('Desativar este produto?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Produto desativado.');
      await fetchProducts();
    } catch {
      toast.error('Erro ao desativar produto.');
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Carregando produtos...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="w-6 h-6 text-orange-600" />
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Produtos</h1>
        <button onClick={openCreate} className="ml-auto btn-primary text-sm flex items-center gap-1">
          <Plus className="w-4 h-4" /> Novo produto
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Produto</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Categoria</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Preço</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Estoque</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded" />
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.category}</td>
                  <td className="px-4 py-3 font-semibold text-indigo-600">{formatCurrency(Number(product.price))}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${product.stock === 0 ? 'text-red-600' : product.stock < 5 ? 'text-orange-600' : 'text-green-700'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(product)} className="text-blue-500 hover:text-blue-700">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeactivate(product.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                {editing ? 'Editar produto' : 'Novo produto'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {[
                { label: 'Nome', key: 'name', placeholder: 'Nome do produto' },
                { label: 'Categoria', key: 'category', placeholder: 'Ex: Eletrônicos' },
                { label: 'URL da Imagem', key: 'imageUrl', placeholder: 'https://...' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={(form as Record<string, unknown>)[field.key] as string}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    className="input-field"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="input-field"
                  rows={3}
                  placeholder="Descrição do produto..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                    className="input-field"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: parseInt(e.target.value) || 0 }))}
                    className="input-field"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
              <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

