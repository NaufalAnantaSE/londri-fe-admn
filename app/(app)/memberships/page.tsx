'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/page-header';
import SkeletonList from '@/components/skeleton-list';
import EmptyState from '@/components/empty-state';
import BottomSheet from '@/components/bottom-sheet';
import SearchInput from '@/components/search-input';
import { membershipsApi, membershipTiersApi } from '@/lib/api';
import { formatRupiah, formatTanggal } from '@/lib/utils';
import type { MembershipStatus } from '@/lib/types';
import { MEMBER_BADGE, MEMBER_LABEL } from '@/lib/labels';
import { Crown, FunnelSimple, CircleNotch } from '@phosphor-icons/react';

export default function MembershipsPage() {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [status, setStatus] = useState<MembershipStatus | undefined>();
  const [tierId, setTierId] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  // Draft: perubahan filter baru berlaku saat "Terapkan" (konsisten dgn halaman Order).
  const [draftStatus, setDraftStatus] = useState<MembershipStatus | undefined>();
  const [draftTierId, setDraftTierId] = useState('');

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
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = query;
  useEffect(() => {
    const el = sentinel.current; if (!el) return;
    const obs = new IntersectionObserver((es) => { if (es[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage(); });
    obs.observe(el); return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const activeCount = (status ? 1 : 0) + (tierId ? 1 : 0);

  return (
    <>
      <PageHeader title="Membership" right={
        <button onClick={() => { setDraftStatus(status); setDraftTierId(tierId); setFilterOpen(true); }} className="relative flex h-10 w-10 items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-slate-800" aria-label="Filter">
          <FunnelSimple size={20} weight={activeCount > 0 ? 'fill' : 'regular'} className={activeCount > 0 ? 'text-sky-600 dark:text-sky-400' : undefined} />
          {activeCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white">{activeCount}</span>}
        </button>
      } />
      <div className="sticky top-[56px] z-30 bg-white dark:bg-slate-900 px-4 py-2">
        <SearchInput value={search} onChange={setSearch} placeholder="Cari nama / telepon…" />
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
          {!(query.data?.pages[0]?.items?.length) && <EmptyState icon={Crown} title="Belum ada member" description={activeCount || debounced ? 'Coba ubah kata kunci atau filter' : undefined} />}
          <div ref={sentinel} className="h-4" />
          {query.isFetchingNextPage && <p className="flex items-center justify-center gap-1.5 py-2 text-center text-xs text-slate-400 dark:text-slate-500"><CircleNotch size={14} className="animate-spin" /> Memuat…</p>}
        </div>
      )}
      <BottomSheet open={filterOpen} onClose={() => setFilterOpen(false)} title="Filter Member">
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-medium">Status</p>
            <div className="flex gap-2">
              {(['ACTIVE', 'EXPIRED', 'BLOCKED'] as MembershipStatus[]).map((s) => (
                <button key={s} onClick={() => setDraftStatus(draftStatus === s ? undefined : s)}
                  className={`min-h-[36px] flex-1 rounded-full text-xs font-medium ${draftStatus === s ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  {MEMBER_LABEL[s]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Tier</p>
            <select value={draftTierId} onChange={(e) => setDraftTierId(e.target.value)} className="min-h-[44px] w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-sm">
              <option value="">Semua tier</option>
              {(tiers?.items || []).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button onClick={() => { setDraftStatus(undefined); setDraftTierId(''); setStatus(undefined); setTierId(''); setFilterOpen(false); }}
              className="min-h-[48px] rounded-xl border border-slate-200 dark:border-slate-700 font-medium">Reset</button>
            <button onClick={() => { setStatus(draftStatus); setTierId(draftTierId); setFilterOpen(false); }}
              className="min-h-[48px] rounded-xl bg-sky-500 font-semibold text-white">Terapkan</button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
