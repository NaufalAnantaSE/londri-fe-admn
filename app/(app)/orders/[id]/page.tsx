'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageHeader from '@/components/page-header';
import BottomSheet from '@/components/bottom-sheet';
import { ordersApi } from '@/lib/api';
import { apiMessage } from '@/lib/api/client';
import { formatRupiah, formatTanggal } from '@/lib/utils';
import { STATUS_BADGE, STATUS_LABEL, STATUS_DOT, PAYMENT_LABEL, ORDER_FLOW } from '@/lib/labels';
import type { OrderStatus } from '@/lib/types';
import { toast } from '@/hooks/useToast';
import SkeletonList from '@/components/skeleton-list';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const qc = useQueryClient();
  const [sheet, setSheet] = useState(false);
  const { data: order, isLoading } = useQuery({ queryKey: ['order', params.id], queryFn: () => ordersApi.get(params.id) });
  const mutation = useMutation({
    mutationFn: ({ status }: { status: OrderStatus }) => ordersApi.updateStatus(params.id, status),
    onSuccess: () => {
      toast.success('Status diperbarui');
      setSheet(false);
      qc.invalidateQueries({ queryKey: ['order', params.id] });
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (e) => toast.error(apiMessage(e)),
  });

  if (isLoading || !order) return <><PageHeader title="Detail Order" back /><SkeletonList count={5} /></>;
  const currentIdx = ORDER_FLOW.indexOf(order.status);
  const isTerminal = order.status === 'COMPLETED' || order.status === 'CANCELLED';
  const nextOptions = !isTerminal ? [ORDER_FLOW[currentIdx + 1], 'CANCELLED' as OrderStatus].filter(Boolean) : [];

  return (
    <>
      <PageHeader title={order.invoiceNumber} back />
      <div className="space-y-4 p-4 pb-28">
        <section className="rounded-2xl border border-slate-100 dark:border-slate-800 glass p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-bold">{order.customerName}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{order.phoneNumber}</p>
              {order.address && <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{order.address}</p>}
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[order.status]}`}>{STATUS_LABEL[order.status]}</span>
          </div>
          <div className="mt-4 space-y-1 border-t border-dashed pt-3 text-sm text-slate-500 dark:text-slate-400">
            <p>Cabang: <b className="text-slate-700 dark:text-slate-200">{order.branch?.name}</b></p>
            <p>Kasir: <b className="text-slate-700 dark:text-slate-200">{order.staff?.fullName}</b></p>
            <p>Metode: <b className="text-slate-700 dark:text-slate-200">{PAYMENT_LABEL[order.paymentMethod]}</b></p>
            <p>Dibuat: {formatTanggal(order.createdAt, true)}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-100 dark:border-slate-800 glass p-4 shadow-sm">
          <h3 className="mb-3 font-semibold">Item Layanan</h3>
          <div className="space-y-2">
            {order.items?.map((it) => (
              <div key={it.id} className="flex justify-between text-sm">
                <span>{it.service?.name} <span className="text-slate-400 dark:text-slate-500">× {Number(it.quantity)}</span></span>
                <b>{formatRupiah(it.subtotal)}</b>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-1.5 border-t border-dashed pt-3 text-sm">
            <div className="flex justify-between text-slate-500 dark:text-slate-400"><span>Subtotal</span><span>{formatRupiah(order.subtotal)}</span></div>
            {Number(order.discountAmount) > 0 && <div className="flex justify-between text-emerald-600"><span>Diskon {order.promotion ? `(${order.promotion.code})` : ''}</span><span>-{formatRupiah(order.discountAmount)}</span></div>}
            {Number(order.membershipAmountUsed) > 0 && <div className="flex justify-between text-sky-600"><span>Saldo membership</span><span>-{formatRupiah(order.membershipAmountUsed)}</span></div>}
            <div className="flex justify-between border-t pt-2 text-base font-bold"><span>Total</span><span>{formatRupiah(order.totalAmount)}</span></div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/60 dark:border-slate-800 glass p-4 shadow-sm">
          <h3 className="mb-4 font-semibold">Riwayat Status</h3>
          <ol className="relative">
            {(order.logs || []).map((log, i) => {
              const isLatest = i === (order.logs?.length ?? 0) - 1;
              const color = STATUS_DOT[log.status];
              return (
                <li key={log.id} className="relative pb-6 pl-8 last:pb-0">
                  {/* garis vertikal penghubung */}
                  {i < (order.logs?.length ?? 0) - 1 && (
                    <span className="absolute left-[7px] top-5 h-full w-px bg-slate-200 dark:bg-slate-700" />
                  )}
                  <span
                    className={`absolute left-0 top-0.5 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 ${isLatest ? 'ring-4 ring-sky-100 dark:ring-sky-950' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                  <p className="text-sm font-semibold">{STATUS_LABEL[log.status]}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{log.staff?.fullName} · {formatTanggal(log.createdAt, true)}</p>
                  {log.notes && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{log.notes}</p>}
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      {!isTerminal && nextOptions.length > 0 && (
        <div className="glass-strong fixed inset-x-0 bottom-16 z-40 mx-auto max-w-md p-4 safe-bottom">
          <button onClick={() => setSheet(true)} className="min-h-[48px] w-full rounded-xl bg-sky-500 font-semibold text-white active:bg-sky-600">
            Ubah Status
          </button>
        </div>
      )}

      <BottomSheet open={sheet} onClose={() => setSheet(false)} title="Ubah Status Order">
        <div className="space-y-2">
          {nextOptions.map((s) => (
            <button key={s} disabled={mutation.isPending} onClick={() => mutation.mutate({ status: s })}
              className={`flex min-h-[48px] w-full items-center justify-between rounded-xl border px-4 text-left font-medium active:bg-slate-50 dark:active:bg-slate-800 disabled:opacity-50 ${s === 'CANCELLED' ? 'border-red-200 text-red-600' : 'border-slate-200 dark:border-slate-700'}`}>
              {STATUS_LABEL[s]}
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_BADGE[s]}`}>{s}</span>
            </button>
          ))}
          <p className="pt-2 text-xs text-slate-400 dark:text-slate-500">Status hanya bisa maju satu langkah sesuai alur, atau dibatalkan.</p>
        </div>
      </BottomSheet>
    </>
  );
}
