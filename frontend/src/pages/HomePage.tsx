import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Truck, 
  Star, 
  ArrowRight, 
  BookOpen, 
  Zap, 
  Flame, 
  Gift, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export default function HomePage() {
  const featuredCategories = [
    {
      title: 'Mangás Shonen & Seinen',
      desc: 'Os volumes mais aguardados e clássicos completos com páginas coloridas.',
      tag: 'Mais Vendidos',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
      icon: Flame,
      color: 'from-orange-500/20 to-red-600/30',
      border: 'border-orange-500/30 hover:border-orange-500',
    },
    {
      title: 'Action Figures & Estátuas',
      desc: 'Colecionáveis originais importados com acabamento premium e certificados.',
      tag: 'Edições Limitadas',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: Sparkles,
      color: 'from-purple-500/20 to-pink-600/30',
      border: 'border-purple-500/30 hover:border-purple-500',
    },
    {
      title: 'Vestuário & Acessórios Geek',
      desc: 'Camisetas exclusivas, moletons oversized, mantos e cosplays detalhados.',
      tag: 'Coleção 2026',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      icon: Zap,
      color: 'from-cyan-500/20 to-blue-600/30',
      border: 'border-cyan-500/30 hover:border-cyan-500',
    },
  ];

  const highlights = [
    {
      title: 'Envio Rápido & Protegido',
      desc: 'Embalagem reforçada anti-impacto para seus mangás chegarem sem nenhum amassado.',
      icon: Truck,
      color: 'text-amber-400 bg-amber-400/10',
    },
    {
      title: '100% Originais & Oficiais',
      desc: 'Parcerias com as principais editoras e fabricantes de colecionáveis do Japão.',
      icon: ShieldCheck,
      color: 'text-emerald-400 bg-emerald-400/10',
    },
    {
      title: 'Brindes & Marcadores Exclusivos',
      desc: 'Todo pedido acompanha marcadores temáticos e cards colecionáveis de brinde.',
      icon: Gift,
      color: 'text-pink-400 bg-pink-400/10',
    },
    {
      title: 'Clube de Benefícios Otaku',
      desc: 'Acumule pontos em cada compra e troque por descontos nas próximas pré-vendas.',
      icon: Star,
      color: 'text-purple-400 bg-purple-400/10',
    },
  ];

  const popularSeries = [
    'Jujutsu Kaisen',
    'Chainsaw Man',
    'One Piece',
    'Attack on Titan',
    'Demon Slayer',
    'Solo Leveling',
    'Spy x Family',
    'Berserk'
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-pink-500 selection:text-white">
      {/* Top Banner de Oferta */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white px-4 py-2.5 text-center text-sm font-semibold tracking-wide shadow-md">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>FESTIVAL GEEK: Frete Grátis para todo o Brasil em compras acima de R$ 199 + Brinde Surpresa!</span>
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-sm font-semibold mb-6 backdrop-blur-sm">
            <Flame className="w-4 h-4 text-pink-400" />
            <span>O Maior Universo Geek & Otaku</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-tight">
            Seus <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">Mangás Favoritos</span> <br className="hidden sm:inline" />
            e Colecionáveis Exclusivos
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto font-normal leading-relaxed">
            Mergulhe no multiverso de histórias épicas, action figures detalhadas, 
            light novels raras e edições de luxo para completar sua estante com estilo.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
            <Link
              to="/products"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 shadow-lg shadow-purple-500/30 flex items-center gap-2 text-base"
            >
              Explorar Catálogo <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/register"
              className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 px-8 py-3.5 rounded-xl font-bold transition-all hover:border-pink-500/50"
            >
              Criar Conta VIP
            </Link>
          </div>

          {/* Tags de Séries Populares */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-slate-800/80 text-xs sm:text-sm text-slate-400">
            <span className="font-semibold text-slate-300 mr-1">Em alta agora:</span>
            {popularSeries.map((series) => (
              <span
                key={series}
                className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-slate-300 hover:border-purple-500/50 hover:text-white transition-colors cursor-pointer"
              >
                #{series}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categorias Principais */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-pink-400 font-bold tracking-wider text-xs uppercase mb-2">
            <BookOpen className="w-4 h-4" /> Categorias em Destaque
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Escolha seu Próximo Universo
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mt-2">
            Navegue pelos nossos departamentos temáticos com lançamentos semanais e promoções imperdíveis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCategories.map((item) => (
            <Link
              key={item.title}
              to="/products"
              className={`group relative rounded-2xl p-7 bg-gradient-to-b ${item.color} bg-slate-900/90 border ${item.border} transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl hover:shadow-purple-950/50 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-slate-800/80 rounded-xl text-white group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-pink-400" />
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${item.badgeColor}`}>
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              <div className="flex items-center text-sm font-bold text-pink-400 group-hover:text-pink-300 gap-1.5 pt-2">
                Ver Coleção <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Diferenciais da Loja Geek */}
      <section className="py-16 px-4 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((feat) => (
              <div key={feat.title} className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className={`p-3.5 rounded-xl ${feat.color} mb-4 inline-flex items-center justify-center`}>
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base mb-1.5">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Promocional de Lançamento */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-purple-900/60 via-slate-900 to-pink-900/60 border border-purple-500/30 p-8 sm:p-12 relative overflow-hidden text-center shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-10 -top-10 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-pink-400 text-sm font-bold uppercase tracking-wider mb-2 inline-block">
              Pré-vendas Abertas
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Garanta sua Edição Especial de Colecionador
            </h2>
            <p className="text-slate-300 text-base mb-8">
              Junte-se a milhares de fãs e colecionadores. Tenha acesso prioritário 
              às novidades, caixas com edições especiais e cupons exclusivos.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/products"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-pink-500/25 flex items-center gap-2"
              >
                Conferir Produtos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Geek */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 font-black text-xl text-white mb-3">
                <BookOpen className="w-5 h-5 text-pink-500" />
                <span>Manga<span className="text-pink-500">Verse</span></span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sua loja geek completa para mangás, quadrinhos, action figures e o melhor da cultura pop oriental e ocidental.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Departamentos</h4>
              <ul className="text-xs space-y-2">
                <li><Link to="/products" className="hover:text-pink-400 transition-colors">Mangás & HQs</Link></li>
                <li><Link to="/products" className="hover:text-pink-400 transition-colors">Action Figures</Link></li>
                <li><Link to="/products" className="hover:text-pink-400 transition-colors">Light Novels</Link></li>
                <li><Link to="/products" className="hover:text-pink-400 transition-colors">Vestuário Geek</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Ajuda & Atendimento</h4>
              <ul className="text-xs space-y-2">
                <li className="hover:text-pink-400 transition-colors cursor-pointer">Acompanhar Meu Pedido</li>
                <li className="hover:text-pink-400 transition-colors cursor-pointer">Prazos de Entrega</li>
                <li className="hover:text-pink-400 transition-colors cursor-pointer">Trocas e Devoluções</li>
                <li className="hover:text-pink-400 transition-colors cursor-pointer">Fale Conosco</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Formas de Pagamento</h4>
              <p className="text-xs text-slate-400 mb-3">
                Aceitamos cartões de crédito em até 12x, Pix com 5% de desconto e boleto bancário.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Pagamento 100% Criptografado
              </div>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-8 text-center text-xs text-slate-500">
            <p>© {new Date().getFullYear()} MangaVerse Store Ltda. Todos os direitos reservados. CNPJ: 42.123.456/0001-99</p>
            <p className="mt-1">Imagens e marcas registradas pertencem aos seus respectivos autores e estúdios.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
