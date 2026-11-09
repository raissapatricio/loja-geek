import { Response } from 'express';
import prisma from '../config/prisma';
import { checkoutSchema } from '../utils/schemas';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { generateTrackingCode } from '../utils/validators';
import { detectCardBrand, simulatePayment } from '../utils/crypto';

// POST /api/orders/checkout
export const checkout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const data = checkoutSchema.parse(req.body);

    // Verifica se o endereço pertence ao usuário autenticado (A01 - Broken Access Control)
    const address = await prisma.address.findFirst({
      where: { id: String(data.addressId), userId },
    });

    if (!address) {
      res.status(400).json({ error: 'Endereço inválido.' });
      return;
    }

    // Busca todos os produtos do banco para validar preços e estoque no servidor
    // NUNCA confia nos valores enviados pelo frontend
    const productIds = data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
    });

    // Valida que todos os produtos existem
    if (products.length !== productIds.length) {
      res.status(400).json({ error: 'Um ou mais produtos não estão disponíveis.' });
      return;
    }

    // Mapa para acesso rápido
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Valida estoque e calcula subtotal com preços do banco (não do frontend)
    let subtotal = 0;
    const orderItems: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
    }> = [];

    for (const item of data.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        res.status(400).json({ error: `Produto não encontrado.` });
        return;
      }
      if (product.stock < item.quantity) {
        res.status(400).json({
          error: `Estoque insuficiente para "${product.name}". Disponível: ${product.stock}.`,
        });
        return;
      }
      const unitPrice = Number(product.price);
      subtotal += unitPrice * item.quantity;
      orderItems.push({ productId: item.productId, quantity: item.quantity, unitPrice });
    }

    // Calcula frete (fictício: R$15 fixo; grátis acima de R$299)
    const shipping = subtotal >= 299 ? 0 : 15;
    const total = subtotal + shipping;

    // Dados do cartão — NUNCA armazena CVV ou número completo
    const { number, expiryMonth, expiryYear, brand } = data.card;
    const lastFour = number.slice(-4);
    const detectedBrand = detectCardBrand(number) || brand;

    // Simula aprovação do pagamento no backend
    const paymentApproved = simulatePayment(lastFour);

    // Cria pedido com transação — garante consistência
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          addressId: address.id,
          subtotal,
          shipping,
          total,
          paymentStatus: paymentApproved ? 'APPROVED' : 'REJECTED',
          orderStatus: paymentApproved ? 'PAYMENT_APPROVED' : 'PLACED',
          trackingCode: paymentApproved ? generateTrackingCode() : null,
          items: {
            create: orderItems,
          },
          cardInfo: {
            create: {
              brand: detectedBrand,
              lastFour,
              expiryMonth,
              expiryYear,
              // CVV NUNCA é armazenado
            },
          },
          delivery: {
            create: {
              status: paymentApproved ? 'PAYMENT_APPROVED' : 'PLACED',
            },
          },
        },
        include: {
          items: {
            include: { product: { select: { name: true, imageUrl: true } } },
          },
          cardInfo: true,
          delivery: true,
        },
      });

      // Decrementa estoque apenas se pagamento aprovado
      if (paymentApproved) {
        for (const item of orderItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      return newOrder;
    });

    res.status(201).json({
      message: paymentApproved
        ? 'Pedido realizado com sucesso! Pagamento aprovado.'
        : 'Pedido criado, mas pagamento recusado. Tente outro cartão.',
      order: {
        id: order.id,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        trackingCode: order.trackingCode,
        items: order.items,
        card: {
          brand: order.cardInfo?.brand,
          lastFour: order.cardInfo?.lastFour,
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

// GET /api/orders — Lista pedidos do usuário autenticado
export const listMyOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id }, // Sempre filtra pelo usuário autenticado
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: { select: { name: true, imageUrl: true, category: true } },
          },
        },
        address: true,
        delivery: true,
        cardInfo: { select: { brand: true, lastFour: true } },
      },
    });

    res.json(orders);
  } catch (error) {
    throw error;
  }
};

// GET /api/orders/:id — Detalhe de um pedido (verifica propriedade)
export const getOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId: req.user!.id, // A01: garante que só o dono vê o pedido
      },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, imageUrl: true, category: true } },
          },
        },
        address: true,
        delivery: true,
        cardInfo: { select: { brand: true, lastFour: true } },
      },
    });

    if (!order) {
      res.status(404).json({ error: 'Pedido não encontrado.' });
      return;
    }

    res.json(order);
  } catch (error) {
    throw error;
  }
};

// ADMIN: GET /api/admin/orders
export const listAllOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
        address: true,
        delivery: true,
        cardInfo: { select: { brand: true, lastFour: true } },
      },
    });

    res.json(orders);
  } catch (error) {
    throw error;
  }
};

// ADMIN: PATCH /api/admin/orders/:id/status
export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { orderStatus } = req.body;

    const validStatuses = [
      'PLACED', 'PAYMENT_APPROVED', 'PREPARING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED',
    ];

    if (!validStatuses.includes(orderStatus)) {
      res.status(400).json({ error: 'Status inválido.' });
      return;
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id },
        data: { orderStatus },
      });

      await tx.delivery.updateMany({
        where: { orderId: id },
        data: {
          status: orderStatus,
          deliveredAt: orderStatus === 'DELIVERED' ? new Date() : undefined,
        },
      });
    });

    res.json({ message: 'Status atualizado com sucesso.' });
  } catch (error) {
    throw error;
  }
};
