import { Link } from 'react-router-dom';
import { Shield, Lock, CreditCard, Truck, Star, ArrowRight, Package } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Banner Aviso Acadêmico */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
        <p className="text-center text-sm text-amber-800 font-medium">
          🎓 <strong>Ambiente Acadêmico de Simulação</strong> — Este é um sistema educacional. Nenhum dado real é processado. Nenhuma cobrança é realizada.
        </p>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="w-12 h-12 text-indigo-200" />
            <h1 className="text-5xl font-bold">SecureCommerce</h1>
          </div>
          <p className="text-xl text-indigo-100 mb-4 max-w-2xl mx-auto">
            E-commerce demonstrativo com foco em <strong>segurança da informação</strong> e boas práticas OWASP.
          </p>
          <p className="text-indigo-200 mb-8">
            Autenticação segura · Proteção de dados · Prevenção de Injeção SQL · RBAC · Rate Limiting
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products" className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-2">
              Ver Produtos <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/register" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-700 transition-colors">
              Criar Conta
            </Link>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Segurança em Cada Camada
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Este projeto implementa mecanismos de proteção baseados nas recomendações do OWASP Top 10
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Lock,
                title: 'A01 — Broken Access Control',
                desc: 'RBAC, proteção de rotas, verificação de propriedade de recursos. Usuários só acessam seus próprios dados.',
                color: 'text-blue-600',
                bg: 'bg-blue-50',
              },
              {
                icon: Shield,
                title: 'A02 — Cryptographic Failures',
                desc: 'Senhas com bcrypt (salt 12 rounds). CVV nunca armazenado. Cookies HttpOnly e Secure.',
                color: 'text-green-600',
                bg: 'bg-green-50',
              },
              {
                icon: Package,
                title: 'A03 — Injection',
                desc: 'ORM Prisma com consultas parametrizadas. Validação com Zod em todas as entradas de dados.',
                color: 'text-purple-600',
                bg: 'bg-purple-50',
              },
              {
                icon: Star,
                title: 'A05 — Security Misconfiguration',
                desc: 'Helmet.js com headers de segurança. CORS configurado. Variáveis de ambiente protegidas.',
                color: 'text-orange-600',
                bg: 'bg-orange-50',
              },
              {
                icon: CreditCard,
                title: 'A07 — Auth Failures',
                desc: 'Rate limiting no login (5 tentativas/15min). Mensagens genéricas. Expiração de sessão.',
                color: 'text-red-600',
                bg: 'bg-red-50',
              },
              {
                icon: Truck,
                title: 'A04 — Insecure Design',
                desc: 'Valores recalculados no backend. Nunca confia no cliente para preços ou estoques.',
                color: 'text-teal-600',
                bg: 'bg-teal-50',
              },
            ].map((feature) => (
              <div key={feature.title} className={`${feature.bg} rounded-xl p-6`}>
                <feature.icon className={`w-8 h-8 ${feature.color} mb-3`} />
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Pronto para explorar?</h2>
          <p className="text-gray-600 mb-8">
            Crie uma conta, navegue pelos produtos, finalize uma compra e acompanhe a entrega.
            Todos os dados são fictícios e seguros.
          </p>
          <Link to="/register" className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2">
            Começar agora <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center">
        <p className="text-sm">
          SecureCommerce — Projeto Acadêmico de E-commerce Seguro · Desenvolvido com React, Node.js, Prisma e PostgreSQL
        </p>
        <p className="text-xs mt-2 text-gray-500">
          Implementa OWASP Top 10 · JWT HttpOnly Cookies · bcrypt · Zod · Helmet · Rate Limiting
        </p>
      </footer>
    </div>
  );
}

