'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/page-header';
import SkeletonList from '@/components/skeleton-list';
import EmptyState from '@/components/empty-state';
import BottomSheet from '@/components/bottom-sheet';
import { ordersApi, branchesApi, OrderFilters } from '@/lib/api';
import { formatRupiah, formatTanggal } from '@/lib/utils';
import type { OrderStatus, PaymentMethod } from '@/lib/types';
import { STATUS_BADGE, STATUS_LABEL, PAYMENT_LABEL } from '@/lib/labels';

const STATUSES = Object.keys(STATUS_LABEL) as OrderStatus[];
const PAYMENTS = Object.keys(PAYMENT_LABEL) as PaymentMethod[];

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<OrderFilters>({});
  const [draft, setDraft] = useState<OrderFilters>({});

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const params = useMemo(() => ({ ...filters, search: debounced || undefined, limit: 15 }), [filters, debounced]);
  const query = useInfiniteQuery({
    queryKey: ['orders', params],
    queryFn: ({ pageParam }) => ordersApi.list({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.pages ? last.page + 1 : undefined),
  });
  const { data: branches } = useQuery({ queryKey: ['branches-all'], queryFn: () => branchesApi.list({ limit: 100 }) });

  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver((es) => { if (es[0].isIntersecting && query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage(); });
    obs.observe(el);
    return () => obs.disconnect();
  }, [query]);

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <>
      <PageHeader title="Order" right={
        <button onClick={() => { setDraft(filters); setFilterOpen(true); }}
          className="relative flex h-10 w-10 items-center justify-center rounded-full active:bg-slate-100 dark:bg-slate-950" aria-label="Filter">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><path strokeLinecap="round" d="M3 6h18M7 12h10m-7 6h4" /></svg>
          {activeCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white">{activeCount}</span>}
        </button>
      } />
      <div className="sticky top-[56px] z-30 bg-white dark:bg-slate-900 px-4 py-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari invoice / pelanggan…"
          className="min-h-[44px] w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:bg-slate-800 px-4 text-sm outline-none focus:border-sky-400 dark:focus:border-sky-600" />
      </div>

      {query.isLoading ? <SkeletonList /> : (
        <div className="space-y-3 p-4">
          {(query.data?.pages || []).flatMap((p) => p.items).map((o) => (
            <Link key={o.id} href={`/orders/${o.id}`} className="block rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm active:bg-slate-50 dark:bg-slate-800 dark:bg-slate-800">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold">{o.invoiceNumber}</p>
                  <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{o.customerName} · {o.branch?.name}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_BADGE[o.status]}`}>{STATUS_LABEL[o.status]}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-400 dark:text-slate-500">{formatTanggal(o.createdAt, true)}</span>
                <span className="font-bold">{formatRupiah(o.totalAmount)}</span>
              </div>
            </Link>
          ))}
          {!(query.data?.pages[0]?.items?.length) && <EmptyState title="Belum ada order" description="Order akan muncul di sini" />}
          <div ref={sentinel} className="h-4" />
          {query.isFetchingNextPage && <p className="py-2 text-center text-xs text-slate-400 dark:text-slate-500">Memuat…</p>}
        </div>
      )}

      <BottomSheet open={filterOpen} onClose={() => setFilterOpen(false)} title="Filter Order">
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-medium">Cabang</p>
            <select value={draft.branchId || ''} onChange={(e) => setDraft({ ...draft, branchId: e.target.value || undefined })}
              className="min-h-[44px] w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-sm">
              <option value="">Semua cabang</option>
              {(branches?.items || []).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button key={s} onClick={() => setDraft({ ...draft, status: draft.status === s ? undefined : s })}
                  className={`min-h-[36px] rounded-full px-3 text-xs font-medium ${draft.status === s ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-300'}`}>
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Metode bayar</p>
            <div className="flex flex-wrap gap-2">
              {PAYMENTS.map((p) => (
                <button key={p} onClick={() => setDraft({ ...draft, paymentMethod: draft.paymentMethod === p ? undefined : p })}
                  className={`min-h-[36px] rounded-full px-3 text-xs font-medium ${draft.paymentMethod === p ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-300'}`}>
                  {PAYMENT_LABEL[p]}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-2 text-sm font-medium">Dari tanggal</p>
              <input type="date" value={draft.dateFrom || ''} onChange={(e) => setDraft({ ...draft, dateFrom: e.target.value || undefined })}
                className="min-h-[44px] w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-sm" />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Sampai</p>
              <input type="date" value={draft.dateTo || ''} onChange={(e) => setDraft({ ...draft, dateTo: e.target.value || undefined })}
                className="min-h-[44px] w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button onClick={() => { setDraft({}); setFilters({}); setFilterOpen(false); }}
              className="min-h-[48px] rounded-xl border border-slate-200 dark:border-slate-700 font-medium">Reset</button>
            <button onClick={() => { setFilters(draft); setFilterOpen(false); }}
              className="min-h-[48px] rounded-xl bg-sky-500 font-semibold text-white">Terapkan</button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
