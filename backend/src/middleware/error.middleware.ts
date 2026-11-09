import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('[ERROR]', err.message);

  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Dados inválidos.',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Nunca expõe detalhes internos em produção
  res.status(500).json({
    error: 'Erro interno do servidor. Tente novamente mais tarde.',
  });
};

