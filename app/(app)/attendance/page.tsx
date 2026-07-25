'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/page-header';
import SkeletonList from '@/components/skeleton-list';
import EmptyState from '@/components/empty-state';
import { attendanceApi, branchesApi, staffsApi } from '@/lib/api';
import { formatTanggal } from '@/lib/utils';
import type { AttendanceType } from '@/lib/types';
import { SignIn, SignOut } from '@phosphor-icons/react';
import { useRef } from 'react';

export default function AttendancePage() {
  const [branchId, setBranchId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [type, setType] = useState<AttendanceType | ''>('');
  const [date, setDate] = useState('');

  const params = useMemo(() => ({ branchId: branchId || undefined, staffId: staffId || undefined, attendanceType: type || undefined, date: date || undefined, limit: 20 }), [branchId, staffId, type, date]);
  const query = useInfiniteQuery({
    queryKey: ['attendance', params],
    queryFn: ({ pageParam }) => attendanceApi.list({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.pages ? last.page + 1 : undefined),
  });
  const { data: branches } = useQuery({ queryKey: ['branches-all'], queryFn: () => branchesApi.list({ limit: 100 }) });
  const { data: staffs } = useQuery({ queryKey: ['staffs-all'], queryFn: () => staffsApi.list({ limit: 100 }) });

  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current; if (!el) return;
    const obs = new IntersectionObserver((es) => { if (es[0].isIntersecting && query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage(); });
    obs.observe(el); return () => obs.disconnect();
  }, [query]);

  return (
    <>
      <PageHeader title="Presensi" back right={
        <Link href="/attendance/qr" className="flex h-10 items-center rounded-xl bg-sky-500 px-3 text-sm font-semibold text-white active:bg-sky-600">
          + QR
        </Link>
      } />
      <div className="space-y-2 bg-white dark:bg-slate-900 px-4 py-3">
        <div className="grid grid-cols-2 gap-2">
          <select value={branchId} onChange={(e) => setBranchId(e.target.value)} className="min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:bg-slate-800 px-3 text-sm">
            <option value="">Semua cabang</option>
            {(branches?.items || []).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select value={staffId} onChange={(e) => setStaffId(e.target.value)} className="min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:bg-slate-800 px-3 text-sm">
            <option value="">Semua staff</option>
            {(staffs?.items || []).map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select value={type} onChange={(e) => setType(e.target.value as AttendanceType | '')} className="min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:bg-slate-800 px-3 text-sm">
            <option value="">Semua tipe</option>
            <option value="CHECK_IN">Check-in</option>
            <option value="CHECK_OUT">Check-out</option>
          </select>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:bg-slate-800 px-3 text-sm" />
        </div>
      </div>
      {query.isLoading ? <SkeletonList /> : (
        <div className="space-y-2 p-4">
          {(query.data?.pages || []).flatMap((p) => p.items).map((a) => (
            <div key={a.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${a.attendanceType === 'CHECK_IN' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600' : 'bg-amber-50 dark:bg-amber-950 text-amber-600'}`}>
                {a.attendanceType === 'CHECK_IN' ? <SignIn size={20} weight='bold' /> : <SignOut size={20} weight='bold' />}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{a.staff?.fullName}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{a.branch?.name} · {a.attendanceType === 'CHECK_IN' ? 'Masuk' : 'Keluar'}</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{formatTanggal(a.scannedAt, true)}</p>
            </div>
          ))}
          {!(query.data?.pages[0]?.items?.length) && <EmptyState title="Belum ada presensi" />}
          <div ref={sentinel} className="h-4" />
        </div>
      )}
    </>
  );
}
