import { z } from 'zod';
import { validateCPF } from '../utils/validators';

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Nome deve ter no mínimo 3 caracteres')
      .max(100, 'Nome muito longo'),
    cpf: z
      .string()
      .min(11, 'CPF inválido')
      .max(14, 'CPF inválido')
      .refine((val) => validateCPF(val), { message: 'CPF inválido' }),
    email: z.string().email('E-mail inválido'),
    phone: z
      .string()
      .regex(/^\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4}$/, 'Telefone inválido'),
    password: z
      .string()
      .min(8, 'Senha deve ter no mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Senha deve conter ao menos uma letra maiúscula')
      .regex(/[0-9]/, 'Senha deve conter ao menos um número'),
    confirmPassword: z.string(),
    address: z.object({
      cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
      street: z.string().min(3, 'Rua inválida'),
      number: z.string().min(1, 'Número obrigatório'),
      complement: z.string().optional(),
      neighborhood: z.string().min(2, 'Bairro inválido'),
      city: z.string().min(2, 'Cidade inválida'),
      state: z.string().length(2, 'Estado deve ter 2 letras'),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  phone: z
    .string()
    .regex(/^\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4}$/, 'Telefone inválido')
    .optional(),
  address: z
    .object({
      cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
      street: z.string().min(3),
      number: z.string().min(1),
      complement: z.string().optional(),
      neighborhood: z.string().min(2),
      city: z.string().min(2),
      state: z.string().length(2),
    })
    .optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Nome do produto obrigatório'),
  description: z.string().min(10, 'Descrição muito curta'),
  imageUrl: z.string().url('URL de imagem inválida'),
  category: z.string().min(2, 'Categoria obrigatória'),
  price: z.number().positive('Preço deve ser positivo'),
  stock: z.number().int().min(0, 'Estoque não pode ser negativo'),
});

export const checkoutSchema = z.object({
  addressId: z.string().min(1, 'Endereço obrigatório'),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive('Quantidade deve ser positiva'),
      })
    )
    .min(1, 'Carrinho não pode estar vazio'),
  card: z.object({
    holderName: z.string().min(3, 'Nome do titular obrigatório'),
    // Número fictício — apenas para demonstração, NÃO é armazenado
    number: z
      .string()
      .regex(/^\d{16}$/, 'Número do cartão deve ter 16 dígitos'),
    expiryMonth: z
      .string()
      .regex(/^(0[1-9]|1[0-2])$/, 'Mês de expiração inválido'),
    expiryYear: z
      .string()
      .regex(/^\d{2,4}$/, 'Ano de expiração inválido'),
    cvv: z.string().regex(/^\d{3,4}$/, 'CVV inválido'),
    brand: z.string().min(2, 'Bandeira obrigatória'),
  }),
});

