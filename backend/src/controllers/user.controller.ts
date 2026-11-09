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
