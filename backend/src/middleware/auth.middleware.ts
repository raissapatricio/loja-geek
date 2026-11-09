import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ error: 'Acesso não autorizado. Faça login para continuar.' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({ error: 'Erro interno de configuração.' });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      email: string;
      role: string;
    };

    // Verifica se o usuário ainda existe e está ativo no banco
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, active: true },
    });

    if (!user || !user.active) {
      res.clearCookie('token');
      res.status(401).json({ error: 'Sessão inválida. Faça login novamente.' });
      return;
    }

    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (error) {
    res.clearCookie('token');
    res.status(401).json({ error: 'Sessão expirada ou inválida. Faça login novamente.' });
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
    return;
  }
  next();
};

