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
  // PRODUTOS FICTÍCIOS
  // =============================================
  const products = await prisma.product.createMany({
    data: [
      // Eletrônicos
      {
        name: 'Smartphone Galaxy Pro 256GB',
        description: 'Smartphone com tela AMOLED 6.7", câmera 108MP, bateria 5000mAh e processador octa-core. Perfeito para produtividade e entretenimento.',
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        category: 'Eletrônicos',
        price: 2499.90,
        stock: 15,
      },
      {
        name: 'Notebook UltraSlim 14" i7',
        description: 'Notebook ultrafino com processador Intel i7, 16GB RAM, SSD 512GB e tela Full HD. Ideal para trabalho e estudos.',
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
        category: 'Eletrônicos',
        price: 4299.00,
        stock: 8,
      },
      {
        name: 'Fone de Ouvido Bluetooth Noise Cancelling',
        description: 'Fone over-ear com cancelamento ativo de ruído, 30h de bateria e áudio Hi-Fi premium. Conexão sem fio estável.',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        category: 'Eletrônicos',
        price: 599.90,
        stock: 30,
      },
      {
        name: 'Smart TV 55" 4K OLED',
        description: 'Televisão 55 polegadas com resolução 4K Ultra HD, painel OLED, sistema operacional inteligente e 4 entradas HDMI.',
        imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500',
        category: 'Eletrônicos',
        price: 3799.00,
        stock: 5,
      },
      {
        name: 'Câmera DSLR 24.2MP',
        description: 'Câmera digital reflex com sensor 24.2MP, gravação 4K, lente 18-55mm inclusa e Wi-Fi integrado. Para fotógrafos de todos os níveis.',
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
        category: 'Eletrônicos',
        price: 2899.00,
        stock: 10,
      },
      // Moda
      {
        name: 'Tênis Esportivo Air Comfort',
        description: 'Tênis de corrida com amortecimento Air, cabedal em mesh respirável e solado de borracha antiderrapante. Disponível em várias cores.',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        category: 'Moda',
        price: 349.90,
        stock: 50,
      },
      {
        name: 'Mochila Executiva 30L',
        description: 'Mochila impermeável com compartimento para notebook 15.6", porta USB externa e alças acolchoadas. Elegante e funcional.',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        category: 'Moda',
        price: 189.90,
        stock: 25,
      },
      {
        name: 'Relógio Smartwatch Fitness',
        description: 'Smartwatch com monitor cardíaco, GPS, resistência à água 5ATM, 7 dias de bateria e mais de 100 modos esportivos.',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        category: 'Moda',
        price: 799.00,
        stock: 20,
      },
      // Casa e Jardim
      {
        name: 'Cafeteira Espresso Automática',
        description: 'Cafeteira com moedor integrado, cappuccinatore e 15 bar de pressão. Faz espresso perfeito em menos de 60 segundos.',
        imageUrl: 'https://images.unsplash.com/photo-1545665277-5937489579f2?w=500',
        category: 'Casa e Jardim',
        price: 1299.90,
        stock: 12,
      },
      {
        name: 'Aspirador Robô Inteligente',
        description: 'Robô aspirador com mapeamento a laser, controle por app, 2h de autonomia e retorno automático à base de carregamento.',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
        category: 'Casa e Jardim',
        price: 1599.00,
        stock: 7,
      },
      {
        name: 'Conjunto de Panelas Antiaderentes 5 peças',
        description: 'Conjunto com revestimento antiaderente premium, cabos de baquelite e fundo triplo para melhor distribuição de calor. Compatível com indução.',
        imageUrl: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500',
        category: 'Casa e Jardim',
        price: 429.90,
        stock: 18,
      },
      // Livros
      {
        name: 'Clean Code — Robert C. Martin',
        description: 'O livro essencial sobre boas práticas de programação. Aprenda a escrever código limpo, legível e fácil de manter.',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
        category: 'Livros',
        price: 89.90,
        stock: 40,
      },
      {
        name: 'The Pragmatic Programmer',
        description: 'Um guia para desenvolvedores que querem aprimorar suas habilidades técnicas e de carreira. Clássico da literatura de TI.',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
        category: 'Livros',
        price: 79.90,
        stock: 35,
      },
      {
        name: 'Segurança em Aplicações Web — OWASP Guide',
        description: 'Guia completo sobre segurança web baseado nas diretrizes OWASP. Aprenda a proteger suas aplicações contra as principais ameaças.',
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500',
        category: 'Livros',
        price: 94.90,
        stock: 22,
      },
      // Esporte
      {
        name: 'Bicicleta Mountain Bike 21 Marchas',
        description: 'Bicicleta aro 29 com quadro de alumínio, freios a disco hidráulicos, 21 marchas Shimano e suspensão dianteira de 100mm.',
        imageUrl: 'https://images.unsplash.com/photo-1558618047-3d5eb4b78b01?w=500',
        category: 'Esporte',
        price: 1899.00,
        stock: 6,
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
      name: 'Administrador SecureCommerce',
      cpf: '52998224725', // CPF válido fictício
      email: 'admin@securecommerce.com',
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
    where: { category: 'Eletrônicos' },
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
  console.log('  Admin:   admin@securecommerce.com / Admin@123456');
  console.log('  Usuário: joao@teste.com / User@123456');
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

