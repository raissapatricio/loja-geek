export type Role = 'USER' | 'ADMIN';

export type OrderStatus =
  | 'PLACED'
  | 'PAYMENT_APPROVED'
  | 'PREPARING'
  | 'SHIPPED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';

export interface Address {
  id: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface User {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: string;
  address?: Address;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  price: number;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: {
    id?: string;
    name: string;
    imageUrl: string;
    category?: string;
  };
}

export interface CardInfo {
  brand: string;
  lastFour: string;
}

export interface Delivery {
  id: string;
  status: OrderStatus;
  trackingCode?: string;
  estimatedAt?: string;
  deliveredAt?: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  subtotal: number;
  shipping: number;
  total: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingCode?: string;
  createdAt: string;
  items: OrderItem[];
  address: Address;
  delivery?: Delivery;
  cardInfo?: CardInfo;
  user?: { id: string; name: string; email: string };
}

export interface PaginatedProducts {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

