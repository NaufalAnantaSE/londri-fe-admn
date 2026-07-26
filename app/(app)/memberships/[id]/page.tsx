'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/page-header';
import SkeletonList from '@/components/skeleton-list';
import EmptyState from '@/components/empty-state';
import { membershipsApi } from '@/lib/api';
import { formatRupiah, formatTanggal } from '@/lib/utils';
import { MEMBER_BADGE, MEMBER_LABEL } from '@/lib/labels';
import { Wallet, Receipt } from '@phosphor-icons/react';

type Tab = 'info' | 'balance' | 'transaksi';

export default function MembershipDetailPage({ params }: { params: { id: string } }) {
  const [tab, setTab] = useState<Tab>('info');
  const { data: m, isLoading } = useQuery({ queryKey: ['membership', params.id], queryFn: () => membershipsApi.get(params.id) });
  const balanceLogs = useQuery({ queryKey: ['membership-balance', params.id], queryFn: () => membershipsApi.balanceLogs(params.id), enabled: tab === 'balance' });
  const transactions = useQuery({ queryKey: ['membership-tx', params.id], queryFn: () => membershipsApi.transactions(params.id), enabled: tab === 'transaksi' });

  if (isLoading || !m) return <><PageHeader title="Detail Member" back /><SkeletonList /></>;

  return (
    <>
      <PageHeader title={m.customerName} back />
      <div className="p-4">
        <section className="rounded-2xl border border-slate-100 dark:border-slate-800 glass p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-bold">{m.customerName}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{m.phoneNumber}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${MEMBER_BADGE[m.status]}`}>{MEMBER_LABEL[m.status]}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-sky-50 dark:bg-sky-950 p-3">
              <p className="text-xs text-sky-600">Saldo</p>
              <p className="mt-0.5 font-bold tabular-nums text-sky-700 dark:text-sky-400">{formatRupiah(m.balance)}</p>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">Tier</p>
              <p className="mt-0.5 font-bold">{m.tier?.name}</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">Berlaku sampai {formatTanggal(m.expiresAt)}</p>
        </section>

        <div className="mt-4 grid grid-cols-3 rounded-xl bg-slate-100 dark:bg-slate-950 p-1">
          {(['info', 'balance', 'transaksi'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`min-h-[40px] rounded-lg text-sm font-medium ${tab === t ? 'bg-white dark:bg-slate-800 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
              {t === 'info' ? 'Info' : t === 'balance' ? 'Saldo' : 'Transaksi'}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {tab === 'info' && (
            <section className="space-y-2 rounded-2xl border border-slate-100 dark:border-slate-800 glass p-5 text-sm shadow-sm">
              <p><span className="text-slate-400 dark:text-slate-500">Nama:</span> {m.customerName}</p>
              <p><span className="text-slate-400 dark:text-slate-500">Telepon:</span> {m.phoneNumber}</p>
              <p><span className="text-slate-400 dark:text-slate-500">Alamat:</span> {m.address || '—'}</p>
              <p><span className="text-slate-400 dark:text-slate-500">Tier:</span> {m.tier?.name} ({formatRupiah(m.tier?.balanceAmount)} / {m.tier?.validityDays} hari)</p>
              <p><span className="text-slate-400 dark:text-slate-500">Terdaftar:</span> {formatTanggal(m.createdAt, true)}</p>
            </section>
          )}
          {tab === 'balance' && (
            balanceLogs.isLoading ? <SkeletonList count={3} /> : (
              <div className="space-y-2">
                {balanceLogs.data?.map((l) => (
                  <div key={l.id} className="rounded-xl border border-slate-100 dark:border-slate-800 glass p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${l.type === 'USAGE' ? 'bg-red-50 dark:bg-red-950 text-red-600' : l.type === 'REFUND' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-300'}`}>
                        {l.type === 'USAGE' ? 'Pemakaian' : l.type === 'REFUND' ? 'Refund' : 'Penyesuaian'}
                      </span>
                      <b className={l.type === 'USAGE' ? 'text-red-600' : 'text-emerald-600'}>
                        {l.type === 'USAGE' ? '-' : '+'}{formatRupiah(l.amount)}
                      </b>
                    </div>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{l.notes || l.order?.invoiceNumber || '—'}</p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Saldo: {formatRupiah(l.balanceBefore)} → {formatRupiah(l.balanceAfter)}</p>
                    <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{formatTanggal(l.createdAt, true)}</p>
                  </div>
                ))}
                {!balanceLogs.data?.length && <EmptyState icon={Wallet} title="Belum ada riwayat saldo" />}
              </div>
            )
          )}
          {tab === 'transaksi' && (
            transactions.isLoading ? <SkeletonList count={3} /> : (
              <div className="space-y-2">
                {transactions.data?.map((t) => (
                  <div key={t.id} className="rounded-xl border border-slate-100 dark:border-slate-800 glass p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{t.currentTier?.name}</p>
                      <b>{formatRupiah(t.purchasePrice)}</b>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Saldo +{formatRupiah(t.balanceAdded)} · via {t.paymentMethod}</p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Cabang {t.branch?.name} · Kasir {t.staff?.fullName}</p>
                    <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{formatTanggal(t.createdAt, true)}</p>
                  </div>
                ))}
                {!transactions.data?.length && <EmptyState icon={Receipt} title="Belum ada transaksi" />}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}
