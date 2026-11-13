import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { maskCPF } from '../utils/validators';

// ADMIN: GET /api/admin/users
export const listUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        phone: true,
        role: true,
        active: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Mascara CPF na listagem administrativa
    res.json(
      users.map((u) => ({ ...u, cpf: maskCPF(u.cpf) }))
    );
  } catch (error) {
    throw error;
  }
};

// ADMIN: PATCH /api/admin/users/:id/toggle
export const toggleUserStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);

    // Impede que o admin desative a própria conta
    if (id === req.user!.id) {
      res.status(400).json({ error: 'Você não pode desativar sua própria conta.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { active: true },
    });

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }

    await prisma.user.update({
      where: { id },
      data: { active: !user.active },
    });

    res.json({ message: `Usuário ${user.active ? 'desativado' : 'ativado'} com sucesso.` });
  } catch (error) {
    throw error;
  }
};

// ADMIN: DELETE /api/admin/users/:id
export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);

    // Impede que o admin exclua a própria conta
    if (id === req.user!.id) {
      res.status(400).json({ error: 'Você não pode excluir sua própria conta.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: { orders: { select: { id: true } } },
    });

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }

    // Exclui em transação para garantir integridade caso o usuário tenha pedidos e endereço vinculados
    await prisma.$transaction(async (tx) => {
      // Deleta pedidos do usuário (itens_pedido, informacoes_cartao e entregas possuem onDelete: Cascade em relação ao Order)
      await tx.order.deleteMany({
        where: { userId: id },
      });

      // Deleta endereço (Address possui onDelete: Cascade no User, mas por segurança garantimos)
      await tx.address.deleteMany({
        where: { userId: id },
      });

      // Deleta o usuário
      await tx.user.delete({
        where: { id },
      });
    });

    res.json({ message: 'Usuário excluído com sucesso.' });
  } catch (error) {
    throw error;
  }
};
