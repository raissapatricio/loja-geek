import type { OrderStatus, PaymentStatus } from '../../types';

const orderStatusLabels: Record<OrderStatus, string> = {
  PLACED: 'Pedido realizado',
  PAYMENT_APPROVED: 'Pagamento aprovado',
  PREPARING: 'Preparando pedido',
  SHIPPED: 'Enviado',
  IN_TRANSIT: 'Em trânsito',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
};

const orderStatusColors: Record<OrderStatus, string> = {
  PLACED: 'badge-gray',
  PAYMENT_APPROVED: 'badge-blue',
  PREPARING: 'badge-yellow',
  SHIPPED: 'badge-blue',
  IN_TRANSIT: 'badge-blue',
  DELIVERED: 'badge-green',
  CANCELLED: 'badge-red',
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  PENDING: 'Pendente',
  APPROVED: 'Aprovado',
  REJECTED: 'Recusado',
  REFUNDED: 'Reembolsado',
};

const paymentStatusColors: Record<PaymentStatus, string> = {
  PENDING: 'badge-yellow',
  APPROVED: 'badge-green',
  REJECTED: 'badge-red',
  REFUNDED: 'badge-gray',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={orderStatusColors[status]}>
      {orderStatusLabels[status]}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={paymentStatusColors[status]}>
      {paymentStatusLabels[status]}
    </span>
  );
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

