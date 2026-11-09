import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { registerSchema, loginSchema, updateProfileSchema } from '../utils/schemas';
import { hashPassword, comparePassword, generateToken, setAuthCookie, clearAuthCookie } from '../utils/crypto';
import { cleanCPF, maskCPF } from '../utils/validators';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body);

    const cpfClean = cleanCPF(data.cpf);

    // Verifica duplicidade — mensagem genérica para não revelar quais dados existem
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { cpf: cpfClean }] },
      select: { id: true },
    });

    if (existing) {
      res.status(409).json({ error: 'Não foi possível criar a conta. Verifique os dados informados.' });
      return;
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        cpf: cpfClean,
        email: data.email,
        phone: data.phone,
        passwordHash,
        address: {
          create: {
            cep: data.address.cep.replace('-', ''),
            street: data.address.street,
            number: data.address.number,
            complement: data.address.complement,
            neighborhood: data.address.neighborhood,
            city: data.address.city,
            state: data.address.state.toUpperCase(),
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    setAuthCookie(res, token);

    res.status(201).json({
      message: 'Conta criada com sucesso!',
      user,
    });
  } catch (error) {
    throw error; // Repassado ao errorHandler
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        active: true,
        name: true,
      },
    });

    // Mensagem genérica — não revela se o e-mail existe ou não (evita enumeração)
    const genericError = 'Credenciais inválidas.';

    if (!user || !user.active) {
      // Executa hash fictício para evitar timing attacks
      await hashPassword('dummy_password_to_prevent_timing_attack');
      res.status(401).json({ error: genericError });
      return;
    }

    const passwordValid = await comparePassword(password, user.passwordHash);
    if (!passwordValid) {
      res.status(401).json({ error: genericError });
      return;
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    setAuthCookie(res, token);

    res.json({
      message: 'Login realizado com sucesso!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    throw error;
  }
};

// POST /api/auth/logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  clearAuthCookie(res);
  res.json({ message: 'Logout realizado com sucesso.' });
};

// GET /api/auth/me
export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        cpf: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        address: {
          select: {
            id: true,
            cep: true,
            street: true,
            number: true,
            complement: true,
            neighborhood: true,
            city: true,
            state: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }

    res.json({
      ...user,
      cpf: maskCPF(user.cpf), // Mascara CPF na resposta
    });
  } catch (error) {
    throw error;
  }
};

// PUT /api/auth/me
export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const data = updateProfileSchema.parse(req.body);

    const updateData: Record<string, unknown> = {};
    if (data.name) updateData.name = data.name;
    if (data.phone) updateData.phone = data.phone;

    if (data.address) {
      await prisma.address.updateMany({
        where: { userId: req.user!.id },
        data: {
          cep: data.address.cep.replace('-', ''),
          street: data.address.street,
          number: data.address.number,
          complement: data.address.complement,
          neighborhood: data.address.neighborhood,
          city: data.address.city,
          state: data.address.state.toUpperCase(),
        },
      });
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id: req.user!.id },
        data: updateData,
      });
    }

    res.json({ message: 'Perfil atualizado com sucesso.' });
  } catch (error) {
    throw error;
  }
};

