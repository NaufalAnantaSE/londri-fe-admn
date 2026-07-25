import type { OrderStatus, PaymentMethod, MembershipStatus } from '@/lib/types';

export const STATUS_BADGE: Record<OrderStatus, string> = {
  WAITING: 'bg-slate-100 text-slate-600', PROCESSING: 'bg-sky-100 text-sky-700',
  WASHING: 'bg-blue-100 text-blue-700', DRYING: 'bg-amber-100 text-amber-700',
  IRONING: 'bg-violet-100 text-violet-700', READY_FOR_PICKUP: 'bg-teal-100 text-teal-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700', CANCELLED: 'bg-red-100 text-red-600',
};
export const STATUS_LABEL: Record<OrderStatus, string> = {
  WAITING: 'Menunggu', PROCESSING: 'Diproses', WASHING: 'Dicuci', DRYING: 'Dikeringkan',
  IRONING: 'Disetrika', READY_FOR_PICKUP: 'Siap Diambil', COMPLETED: 'Selesai', CANCELLED: 'Dibatalkan',
};
export const PAYMENT_LABEL: Record<PaymentMethod, string> = { CASH: 'Tunai', TRANSFER: 'Transfer', QRIS: 'QRIS', MEMBERSHIP: 'Membership' };
export const ORDER_FLOW: OrderStatus[] = ['WAITING', 'PROCESSING', 'WASHING', 'DRYING', 'IRONING', 'READY_FOR_PICKUP', 'COMPLETED'];
export const MEMBER_BADGE: Record<MembershipStatus, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700', EXPIRED: 'bg-amber-100 text-amber-700', BLOCKED: 'bg-red-100 text-red-600',
};
export const MEMBER_LABEL: Record<MembershipStatus, string> = { ACTIVE: 'Aktif', EXPIRED: 'Kedaluwarsa', BLOCKED: 'Diblokir' };
