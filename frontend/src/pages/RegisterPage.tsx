import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/[^\d]/g, '');
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cleaned[i]) * (10 - i);
  let rem = (sum * 10) % 11;
  if (rem === 10 || rem === 11) rem = 0;
  if (rem !== parseInt(cleaned[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cleaned[i]) * (11 - i);
  rem = (sum * 10) % 11;
  if (rem === 10 || rem === 11) rem = 0;
  return rem === parseInt(cleaned[10]);
}

const schema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpf: z.string().refine(validateCPF, 'CPF inválido'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().regex(/^\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4}$/, 'Telefone inválido'),
  password: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter letra maiúscula')
    .regex(/[0-9]/, 'Deve conter número'),
  confirmPassword: z.string(),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  street: z.string().min(3, 'Rua obrigatória'),
  number: z.string().min(1, 'Número obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().length(2, 'Estado: 2 letras'),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'Mínimo 8 caracteres', ok: password.length >= 8 },
    { label: 'Letra maiúscula', ok: /[A-Z]/.test(password) },
    { label: 'Número', ok: /[0-9]/.test(password) },
  ];
  return (
    <div className="mt-1 space-y-1">
      {checks.map((c) => (
        <div key={c.label} className={`flex items-center gap-1 text-xs ${c.ok ? 'text-green-600' : 'text-gray-400'}`}>
          <CheckCircle className="w-3 h-3" />
          {c.label}
        </div>
      ))}
    </div>
  );
}

export default function RegisterPage() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch('password', '');

  // Consulta CEP via ViaCEP (sem expor dados sensíveis)
  const handleCEPBlur = async (cep: string) => {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setValue('street', data.logradouro || '');
        setValue('neighborhood', data.bairro || '');
        setValue('city', data.localidade || '');
        setValue('state', data.uf || '');
      }
    } catch {}
  };

  const onSubmit = async (data: FormData) => {
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: data.name,
        cpf: data.cpf,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
        address: {
          cep: data.cep,
          street: data.street,
          number: data.number,
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
        },
      });
      await refreshUser();
      toast.success('Conta criada com sucesso!');
      navigate('/products');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Erro ao criar conta.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const Field = ({
    label,
    name,
    type = 'text',
    placeholder,
    required = true,
  }: {
    label: string;
    name: keyof FormData;
    type?: string;
    placeholder?: string;
    required?: boolean;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...register(name)}
        type={type}
        className="input-field"
        placeholder={placeholder}
      />
      {errors[name] && (
        <p className="mt-1 text-xs text-red-600">{String(errors[name]?.message)}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold text-indigo-600">SecureCommerce</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>
          <p className="text-sm text-gray-500 mt-1">🔒 Dados fictícios — ambiente acadêmico</p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Dados pessoais */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                Dados Pessoais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Field label="Nome completo" name="name" placeholder="João da Silva" />
                </div>
                <Field label="CPF" name="cpf" placeholder="000.000.000-00" />
                <Field label="Telefone" name="phone" placeholder="(11) 99999-0000" />
                <div className="md:col-span-2">
                  <Field label="E-mail" name="email" type="email" placeholder="seu@email.com" />
                </div>
              </div>
            </div>

            {/* Senha */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                Senha
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="input-field pr-10"
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password && <PasswordStrength password={password} />}
                  {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar senha <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('confirmPassword')}
                    type={showPassword ? 'text' : 'password'}
                    className="input-field"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                Endereço
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('cep')}
                    className="input-field"
                    placeholder="00000-000"
                    onBlur={(e) => handleCEPBlur(e.target.value)}
                  />
                  {errors.cep && <p className="mt-1 text-xs text-red-600">{errors.cep.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <Field label="Rua / Logradouro" name="street" placeholder="Rua das Flores" />
                </div>
                <Field label="Número" name="number" placeholder="123" />
                <div className="md:col-span-2">
                  <Field label="Complemento" name="complement" placeholder="Apto 1" required={false} />
                </div>
                <div className="md:col-span-3">
                  <Field label="Bairro" name="neighborhood" placeholder="Centro" />
                </div>
                <div className="md:col-span-2">
                  <Field label="Cidade" name="city" placeholder="São Paulo" />
                </div>
                <Field label="Estado (UF)" name="state" placeholder="SP" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-semibold"
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

