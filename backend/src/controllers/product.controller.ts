import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { productSchema } from '../utils/schemas';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// GET /api/products
export const listProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, page = '1', limit = '12' } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = { active: true };

    if (category) {
      where.category = category as string;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          category: true,
          price: true,
          stock: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      data: products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    throw error;
  }
};

// GET /api/products/categories
export const listCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.product.findMany({
      where: { active: true },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    res.json(categories.map((c) => c.category));
  } catch (error) {
    throw error;
  }
};

// GET /api/products/:id
export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const idStr = String(id);

    const product = await prisma.product.findFirst({
      where: { id: idStr, active: true },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        category: true,
        price: true,
        stock: true,
      },
    });

    if (!product) {
      res.status(404).json({ error: 'Produto não encontrado.' });
      return;
    }

    res.json(product);
  } catch (error) {
    throw error;
  }
};

// POST /api/admin/products — Admin only
export const createProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const data = productSchema.parse(req.body);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        category: data.category,
        price: data.price,
        stock: data.stock,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    throw error;
  }
};

// PUT /api/admin/products/:id — Admin only
export const updateProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const data = productSchema.partial().parse(req.body);

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    res.json(product);
  } catch (error) {
    throw error;
  }
};

// DELETE /api/admin/products/:id — Admin only (desativa, não remove)
export const deactivateProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);

    await prisma.product.update({
      where: { id },
      data: { active: false },
    });

    res.json({ message: 'Produto desativado com sucesso.' });
  } catch (error) {
    throw error;
  }
};
