export const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
export function formatRupiah(value: string | number | null | undefined) {
  return rupiah.format(Number(value || 0));
}
export function formatTanggal(value: string | Date | null | undefined, withTime = false) {
  if (!value) return '-';
  const date = new Date(value);
  return new Intl.DateTimeFormat('id-ID', withTime
    ? { dateStyle: 'medium', timeStyle: 'short' }
    : { dateStyle: 'medium' }).format(date);
}
export function formatBulan(month: number) {
  return new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(new Date(2024, month - 1, 1));
}
