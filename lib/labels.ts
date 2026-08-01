import type { OrderStatus, PaymentMethod, MembershipStatus } from '@/lib/types';

/* Warna status — token Stitch "Refined Glass".
 *
 * Sebelumnya tiap status punya hue sendiri (sky/blue/amber/violet/teal/emerald):
 * tujuh warna pelangi untuk satu sumbu data. Warna yang berbeda seharusnya
 * berarti KATEGORI yang berbeda, bukan sekadar langkah yang berbeda — kalau
 * setiap langkah diberi hue baru, warna berhenti bermakna dan tinggal jadi
 * dekorasi.
 *
 * Sekarang badge memetakan lima kategori yang benar-benar berbeda maknanya
 * bagi kasir:
 *
 *   netral   menunggu, belum disentuh
 *   info     sedang dikerjakan (4 tahap: proses/cuci/kering/setrika)
 *   warning  butuh tindakan — pelanggan harus dihubungi
 *   sukses   selesai
 *   error    dibatalkan
 *
 * Tahap spesifik tetap terbaca dari STATUS_LABEL di dalam badge, dan urutan
 * progresinya tetap terlihat pada STATUS_DOT di timeline. Jadi tidak ada
 * informasi yang hilang — yang hilang hanya kebisingannya.
 */

const NEUTRAL = 'bg-surface-container text-on-surface-variant dark:bg-white/10 dark:text-outline-variant';
const INFO    = 'bg-primary-container text-on-primary-container dark:bg-primary/25 dark:text-primary-fixed';
const WARNING = 'bg-warning-container text-on-warning-container dark:bg-warning/25 dark:text-warning-container';
const SUCCESS = 'bg-success-container text-on-success-container dark:bg-success/25 dark:text-success-container';
const ERROR   = 'bg-error-container text-on-error-container dark:bg-error/25 dark:text-error-container';

export const STATUS_BADGE: Record<OrderStatus, string> = {
  WAITING: NEUTRAL,
  PROCESSING: INFO,
  WASHING: INFO,
  DRYING: INFO,
  IRONING: INFO,
  READY_FOR_PICKUP: WARNING,
  COMPLETED: SUCCESS,
  CANCELLED: ERROR,
};

/* Titik timeline — hex inline (bukan class Tailwind) karena dipakai sebagai
 * style pada elemen SVG/absolute. Di sinilah progresi tahap memang relevan,
 * jadi keempat tahap pengerjaan memakai ramp hue-198 yang menggelap: pembaca
 * melihat kemajuan tanpa perlu tujuh hue berbeda. */
export const STATUS_DOT: Record<OrderStatus, string> = {
  WAITING: '#bec8d2',           // outline-variant — belum mulai
  PROCESSING: '#89ceff',        // ramp 198 · paling terang
  WASHING: '#4facdb',
  DRYING: '#1a86bd',
  IRONING: '#006591',           // ramp 198 · primary, tahap terakhir pengerjaan
  READY_FOR_PICKUP: '#b45309',  // warning — butuh tindakan
  COMPLETED: '#047857',         // success
  CANCELLED: '#dc2626',         // error
};

export const STATUS_LABEL: Record<OrderStatus, string> = {
  WAITING: 'Menunggu', PROCESSING: 'Diproses', WASHING: 'Dicuci', DRYING: 'Dikeringkan',
  IRONING: 'Disetrika', READY_FOR_PICKUP: 'Siap Diambil', COMPLETED: 'Selesai', CANCELLED: 'Dibatalkan',
};
export const PAYMENT_LABEL: Record<PaymentMethod, string> = { CASH: 'Tunai', TRANSFER: 'Transfer', QRIS: 'QRIS', MEMBERSHIP: 'Membership' };
export const ORDER_FLOW: OrderStatus[] = ['WAITING', 'PROCESSING', 'WASHING', 'DRYING', 'IRONING', 'READY_FOR_PICKUP', 'COMPLETED'];

export const MEMBER_BADGE: Record<MembershipStatus, string> = {
  ACTIVE: SUCCESS,
  EXPIRED: WARNING,
  BLOCKED: ERROR,
};
export const MEMBER_LABEL: Record<MembershipStatus, string> = { ACTIVE: 'Aktif', EXPIRED: 'Kedaluwarsa', BLOCKED: 'Diblokir' };
