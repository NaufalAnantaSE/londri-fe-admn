'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/page-header';
import SkeletonList from '@/components/skeleton-list';
import EmptyState from '@/components/empty-state';
import BottomSheet from '@/components/bottom-sheet';
import { membershipsApi, membershipTiersApi } from '@/lib/api';
import { formatRupiah, formatTanggal } from '@/lib/utils';
import type { MembershipStatus } from '@/lib/types';
import { MEMBER_BADGE, MEMBER_LABEL } from '@/lib/labels';
import { Crown } from '@phosphor-icons/react';

export default function MembershipsPage() {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [status, setStatus] = useState<MembershipStatus | undefined>();
  const [tierId, setTierId] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => { const t = setTimeout(() => setDebounced(search), 400); return () => clearTimeout(t); }, [search]);

  const params = useMemo(() => ({ search: debounced || undefined, status, tierId: tierId || undefined, limit: 15 }), [debounced, status, tierId]);
  const query = useInfiniteQuery({
    queryKey: ['memberships', params],
    queryFn: ({ pageParam }) => membershipsApi.list({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.pages ? last.page + 1 : undefined),
  });
  const { data: tiers } = useQuery({ queryKey: ['tiers-all'], queryFn: () => membershipTiersApi.list({ limit: 100 }) });

  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current; if (!el) return;
    const obs = new IntersectionObserver((es) => { if (es[0].isIntersecting && query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage(); });
    obs.observe(el); return () => obs.disconnect();
  }, [query]);

  return (
    <>
      <PageHeader title="Membership" right={
        <button onClick={() => setFilterOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-slate-800" aria-label="Filter">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><path strokeLinecap="round" d="M3 6h18M7 12h10m-7 6h4" /></svg>
        </button>
      } />
      <div className="sticky top-[56px] z-30 bg-white dark:bg-slate-900 px-4 py-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama / telepon…"
          className="min-h-[44px] w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm outline-none focus:border-sky-400 dark:focus:border-sky-600" />
      </div>
      {query.isLoading ? <SkeletonList /> : (
        <div className="space-y-3 p-4">
          {(query.data?.pages || []).flatMap((p) => p.items).map((m) => (
            <Link key={m.id} href={`/memberships/${m.id}`} className="block rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-transform duration-150 active:scale-[0.98]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{m.customerName}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                    {m.phoneNumber} · <Crown size={13} weight="fill" className="text-amber-500" />{m.tier?.name}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${MEMBER_BADGE[m.status]}`}>{MEMBER_LABEL[m.status]}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-400 dark:text-slate-500">Exp {formatTanggal(m.expiresAt)}</span>
                <span className="font-semibold tabular-nums text-sky-600 dark:text-sky-400">{formatRupiah(m.balance)}</span>
              </div>
            </Link>
          ))}
          {!(query.data?.pages[0]?.items?.length) && <EmptyState emoji="👑" title="Belum ada member" />}
          <div ref={sentinel} className="h-4" />
          {query.isFetchingNextPage && <p className="py-2 text-center text-xs text-slate-400 dark:text-slate-500">Memuat…</p>}
        </div>
      )}
      <BottomSheet open={filterOpen} onClose={() => setFilterOpen(false)} title="Filter Member">
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-medium">Status</p>
            <div className="flex gap-2">
              {(['ACTIVE', 'EXPIRED', 'BLOCKED'] as MembershipStatus[]).map((s) => (
                <button key={s} onClick={() => setStatus(status === s ? undefined : s)}
                  className={`min-h-[36px] flex-1 rounded-full text-xs font-medium ${status === s ? 'bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 text-white shadow-sm shadow-sky-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  {MEMBER_LABEL[s]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Tier</p>
            <select value={tierId} onChange={(e) => setTierId(e.target.value)} className="min-h-[44px] w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-sm">
              <option value="">Semua tier</option>
              {(tiers?.items || []).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <button onClick={() => setFilterOpen(false)} className="min-h-[48px] w-full rounded-xl bg-sky-500 font-semibold text-white">Terapkan</button>
        </div>
      </BottomSheet>
    </>
  );
}
