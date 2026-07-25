import type { OrderStatus, PaymentMethod, MembershipStatus } from '@/lib/types';

export const STATUS_BADGE: Record<OrderStatus, string> = {
  WAITING: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  PROCESSING: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400',
  WASHING: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  DRYING: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  IRONING: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400',
  READY_FOR_PICKUP: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400',
  COMPLETED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  CANCELLED: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
};
// Warna titik timeline (bukan class Tailwind — dipakai inline hex agar konsisten dgn badge)
export const STATUS_DOT: Record<OrderStatus, string> = {
  WAITING: '#94a3b8', PROCESSING: '#0ea5e9', WASHING: '#3b82f6', DRYING: '#f59e0b',
  IRONING: '#8b5cf6', READY_FOR_PICKUP: '#14b8a6', COMPLETED: '#10b981', CANCELLED: '#f87171',
};
export const STATUS_LABEL: Record<OrderStatus, string> = {
  WAITING: 'Menunggu', PROCESSING: 'Diproses', WASHING: 'Dicuci', DRYING: 'Dikeringkan',
  IRONING: 'Disetrika', READY_FOR_PICKUP: 'Siap Diambil', COMPLETED: 'Selesai', CANCELLED: 'Dibatalkan',
};
export const PAYMENT_LABEL: Record<PaymentMethod, string> = { CASH: 'Tunai', TRANSFER: 'Transfer', QRIS: 'QRIS', MEMBERSHIP: 'Membership' };
export const ORDER_FLOW: OrderStatus[] = ['WAITING', 'PROCESSING', 'WASHING', 'DRYING', 'IRONING', 'READY_FOR_PICKUP', 'COMPLETED'];
export const MEMBER_BADGE: Record<MembershipStatus, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  EXPIRED: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  BLOCKED: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
};
export const MEMBER_LABEL: Record<MembershipStatus, string> = { ACTIVE: 'Aktif', EXPIRED: 'Kedaluwarsa', BLOCKED: 'Diblokir' };
