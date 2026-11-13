import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpa dados existentes (em ordem para respeitar FK)
  await prisma.delivery.deleteMany();
  await prisma.cardInfo.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();

  console.log('🗑️  Dados anteriores removidos.');

  // =============================================
  // PRODUTOS — LOJA DE MANGÁS E CULTURA GEEK
  // =============================================
  // As imagens abaixo são capas provisórias (placehold.co).
  // Troque pelas URLs reais pelo painel Admin > Produtos.
  const cover = (text: string, bg: string) =>
    `https://placehold.co/600x800/${bg}/f472b6?text=${encodeURIComponent(text)}`;

  const products = await prisma.product.createMany({
    data: [
      // ---------- Mangás ----------
      {
        name: 'Frieren e a jornada para o além - 01',
        description: 'A história depois de um grupo de heróis terem derrotado o Rei Demônio. Você acompanhará Frieren, uma elfa diferente dos seus três companheiros de viagem. Você verá o que ela viveu no mundo, o que ela sentiu depois da aventura ter terminado. E ainda, sua relação com os que ficaram e o que seria a oração para os mortos... "Essa história começa depois que a aventura termina". "Uma fantasia pós-aventura que conta o modo de viver desses heróis!"',
        imageUrl: 'https://m.media-amazon.com/images/I/71VnRnDjc8L._SL1000_.jpg',
        category: 'Mangás',
        price: 36.90,
        stock: 15,
      },
      {
        name: 'Jujutsu Kaisen — Vol. 1',
        description: 'Yuji Itadori é um estudante comum com força física fora do normal. Quando engole um objeto amaldiçoado, passa a dividir o corpo com uma maldição poderosa e é arrastado para o mundo dos feiticeiros.',
        imageUrl: 'https://m.media-amazon.com/images/I/61ResbP4aPL._AC_UL320_.jpg',
        category: 'Mangás',
        price: 32.90,
        stock: 25,
      },
      {
        name: 'Chainsaw Man — Vol. 1',
        description: 'Denji vive endividado e caça demônios ao lado de Pochita, seu cão-motosserra. Uma traição muda tudo e dá a ele uma nova forma de lutar. Ação crua, humor estranho e muita adrenalina.',
        imageUrl: 'https://m.media-amazon.com/images/I/71wp0XTXsAL._AC_UL320_.jpg',
        category: 'Mangás',
        price: 34.90,
        stock: 20,
      },
      {
        name: 'One Piece — Vol. 1',
        description: 'Monkey D. Luffy sonha em se tornar o Rei dos Piratas. Depois de comer uma fruta misteriosa, ele zarpa para o Grand Line em busca do tesouro lendário deixado por Gol D. Roger.',
        imageUrl: 'https://m.media-amazon.com/images/I/61xOtH1kTsL._AC_UL320_.jpg',
        category: 'Mangás',
        price: 29.90,
        stock: 40,
      },
      {
        name: 'Berserk — Edição de Luxo Vol. 1',
        description: 'Guts, o espadachim negro, anda por um mundo sombrio carregando uma espada enorme e um passado pesado. Clássico absoluto da fantasia sombria, em formato maior e acabamento de colecionador.',
        imageUrl: 'https://m.media-amazon.com/images/I/61K0fW6l1-L._AC_UL320_.jpg',
        category: 'Mangás',
        price: 119.90,
        stock: 8,
      },
      {
        name: 'Spy x Family — Vol. 1',
        description: 'Um espião precisa montar uma família falsa para cumprir sua missão. O problema: a "esposa" é uma assassina e a "filha" lê mentes. Comédia, ação e muito carinho.',
        imageUrl: 'https://m.media-amazon.com/images/I/71vMGRog+iL._AC_UL320_.jpg',
        category: 'Mangás',
        price: 31.90,
        stock: 30,
      },
      {
        name: 'Demon Slayer: Kimetsu no Yaiba — Vol. 1',
        description: 'Depois que sua família é atacada por um demônio e sua irmã Nezuko é transformada em um, Tanjiro decide entrar para os caçadores de demônios para encontrar uma cura.',
        imageUrl: 'https://m.media-amazon.com/images/I/71oZmNhST-L._AC_UL320_.jpg',
        category: 'Mangás',
        price: 29.90,
        stock: 3,
      },
      // ---------- Light Novels ----------
      {
        name: 'Solo Leveling — Livro 1',
        description: 'Sung Jin-Woo é o caçador mais fraco do mundo, até uma dungeon misteriosa lhe dar a chance de subir de nível sem limites. A história que originou o fenômeno do manhwa.',
        imageUrl: 'https://m.media-amazon.com/images/I/91X6rx1HX5L._AC_UL320_.jpg',
        category: 'Light Novels',
        price: 59.90,
        stock: 12,
      },
      {
        name: 'Sword Art Online — Vol. 1: Aincrad',
        description: 'Dez mil jogadores ficam presos em um MMORPG de realidade virtual onde morrer no jogo significa morrer de verdade. Kirito precisa chegar ao último andar para escapar.',
        imageUrl: 'https://m.media-amazon.com/images/I/51XPAnB4dsL._SY445_SX342_ML2_.jpg',
        category: 'Light Novels',
        price: 49.90,
        stock: 10,
      },
      // ---------- Action Figures ----------
      {
        name: 'Action Figure Monkey D. Luffy — Gear 5 (25 cm)',
        description: 'Figure articulada do Luffy em sua forma mais icônica, com base de exibição e acabamento detalhado. Perfeita para a prateleira de quem acompanha a saga até o fim.',
        imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_965918-MLB74329515377_012024-O-luffy-gear-5--one-piece--25cm--kaosfera-3d-studios.webp',
        category: 'Action Figures',
        price: 389.90,
        stock: 6,
      },
      {
        name: 'Action Figure Satoru Gojo — Jujutsu Kaisen (22 cm)',
        description: 'O feiticeiro mais forte em pose de combate, com cabelo e olhos pintados à mão e efeito de energia amaldiçoada na base.',
        imageUrl: 'https://down-br.img.susercontent.com/file/br-11134207-7r98o-mdcu28q9qa6954',
        category: 'Action Figures',
        price: 329.90,
        stock: 9,
      },
      {
        name: 'Figure Denji & Pochita — Chainsaw Man (18 cm)',
        description: 'Denji em modo motosserra ao lado do fiel Pochita. Figure estática com detalhes de sangue e faíscas em relevo.',
        imageUrl: 'https://m.media-amazon.com/images/I/61arE+4r8TL.jpg',
        category: 'Action Figures',
        price: 279.90,
        stock: 2,
      },
      // ---------- Vestuário Geek ----------
      {
        name: 'Camiseta Oversized Gojo Satoru — Jujutsu Kaisen',
        description: 'Camiseta oversized em algodão com estampa frontal do Gojo. Caimento folgado, toque macio e estampa que não desbota fácil.',
        imageUrl: 'https://down-br.img.susercontent.com/file/br-11134207-81z1k-mhgbg1gmups3fd',
        category: 'Vestuário Geek',
        price: 99.90,
        stock: 45,
      },
      {
        name: 'Moletom Akatsuki — Naruto Shippuden',
        description: 'Moletom com capuz preto e nuvens vermelhas, inspirado na capa da Akatsuki. Forro macio e bolso canguru.',
        imageUrl: 'https://m.media-amazon.com/images/I/41jk3PVPejL._AC_SY1000_.jpg',
        category: 'Vestuário Geek',
        price: 189.90,
        stock: 18,
      },
      {
        name: 'Camiseta Haori Xadrez — Tanjiro (Demon Slayer)',
        description: 'Camiseta com estampa xadrez verde e preta inspirada no haori do Tanjiro. Ótima para convenções e para o dia a dia.',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0n4DT6_vKy9W0nj_Dicvhw-vUTvr73rdZzSMQCgtEg3CoCR1EE1lXzag&s=10',
        category: 'Vestuário Geek',
        price: 89.90,
        stock: 35,
      },
      // ---------- Acessórios ----------
      {
        name: 'Kit 6 Marcadores de Página Geek',
        description: 'Seis marcadores magnéticos com ilustrações de séries populares. Não amassam a página e cabem em qualquer volume.',
        imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_780067-MLB93119844959_092025-O.webp',
        category: 'Acessórios',
        price: 24.90,
        stock: 80,
      },
      {
        name: 'Luminária LED Acrílica — Anya Forger (Spy x Family)',
        description: 'Luminária de mesa em acrílico com a Anya gravada e base com LED. Acende por USB e deixa o quarto com clima de anime.',
        imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_638985-CBT105793519432_022026-O.webp',
        category: 'Acessórios',
        price: 79.90,
        stock: 14,
      },
    ],
  });

  console.log(`✅ ${products.count} produtos criados.`);

  // =============================================
  // USUÁRIO ADMINISTRADOR
  // =============================================
  const adminPassword = await bcrypt.hash('Admin@123456', 12);
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador MangaVerse',
      cpf: '52998224725', // CPF válido fictício
      email: 'admin@MangaVerse.com',
      phone: '(11) 99999-0001',
      passwordHash: adminPassword,
      role: 'ADMIN',
      address: {
        create: {
          cep: '01310100',
          street: 'Avenida Paulista',
          number: '1000',
          complement: 'Sala 1',
          neighborhood: 'Bela Vista',
          city: 'São Paulo',
          state: 'SP',
        },
      },
    },
  });

  console.log(`👤 Admin criado: ${admin.email} / Admin@123456`);

  // =============================================
  // USUÁRIO COMUM DE TESTE
  // =============================================
  const userPassword = await bcrypt.hash('User@123456', 12);
  const testUser = await prisma.user.create({
    data: {
      name: 'Raissa Patricio',
      cpf: '11144477735', // CPF válido fictício
      email: 'raissa@teste.com',
      phone: '(12) 98888-7777',
      passwordHash: userPassword,
      role: 'USER',
      address: {
        create: {
          cep: '20040020',
          street: 'Avenida Rio Branco',
          number: '45',
          complement: 'Apto 302',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
        },
      },
    },
  });

  console.log(`👤 Usuário de teste criado: ${testUser.email} / User@123456`);

  // =============================================
  // PEDIDO DE EXEMPLO
  // =============================================
  const userAddress = await prisma.address.findFirst({
    where: { userId: testUser.id },
  });

  const firstProduct = await prisma.product.findFirst({
    where: { category: 'Mangás' },
  });

  if (userAddress && firstProduct) {
    const order = await prisma.order.create({
      data: {
        userId: testUser.id,
        addressId: userAddress.id,
        subtotal: Number(firstProduct.price),
        shipping: 0,
        total: Number(firstProduct.price),
        paymentStatus: 'APPROVED',
        orderStatus: 'IN_TRANSIT',
        trackingCode: 'SC987654321BR',
        items: {
          create: {
            productId: firstProduct.id,
            quantity: 1,
            unitPrice: Number(firstProduct.price),
          },
        },
        cardInfo: {
          create: {
            brand: 'Visa',
            lastFour: '1234',
            expiryMonth: '12',
            expiryYear: '2027',
          },
        },
        delivery: {
          create: {
            status: 'IN_TRANSIT',
            trackingCode: 'SC987654321BR',
            estimatedAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          },
        },
      },
    });

    console.log(`📦 Pedido de exemplo criado: ${order.id}`);
  }

  console.log('\n✅ Seed concluído com sucesso!');
  console.log('='.repeat(50));
  console.log('📋 CREDENCIAIS DE ACESSO:');
  console.log('  Admin:   admin@mangaverse.com / Admin@123456');
  console.log('  Usuário: raissa@teste.com / User@123456');
  console.log('='.repeat(50));
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

