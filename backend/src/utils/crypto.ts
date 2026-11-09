import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: {
  id: string;
  email: string;
  role: string;
}): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET não configurado');

  return jwt.sign(payload, secret, {
    expiresIn: '7d',
  });
}

export function setAuthCookie(res: Response, token: string): void {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: true,          // Inacessível via JavaScript — protege contra XSS
    secure: isProduction,    // HTTPS obrigatório em produção
    sameSite: 'lax',         // Protege contra CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em ms
    path: '/',
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie('token', { path: '/', httpOnly: true });
}

// Detecta a bandeira do cartão fictício com base nos primeiros dígitos
export function detectCardBrand(number: string): string {
  const n = number.replace(/\s/g, '');
  if (/^4/.test(n)) return 'Visa';
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'Mastercard';
  if (/^3[47]/.test(n)) return 'Amex';
  if (/^6(?:011|5)/.test(n)) return 'Discover';
  if (/^(?:2131|1800|35\d{3})/.test(n)) return 'JCB';
  return 'Outro';
}

// Simula aprovação de pagamento (acadêmico)
// Cartões fictícios terminados em 0000 são recusados, demais são aprovados
export function simulatePayment(lastFour: string): boolean {
  return lastFour !== '0000';
}

