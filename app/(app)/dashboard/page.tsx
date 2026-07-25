'use client';
import { useQueries } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';
import { formatRupiah, formatBulan } from '@/lib/utils';
import PageHeader from '@/components/page-header';
import SkeletonList from '@/components/skeleton-list';
import { useTheme } from '@/lib/theme';
import { TrendUp, CalendarCheck, ListChecks, Users } from '@phosphor-icons/react';
import dynamic from 'next/dynamic';

// Dynamic import Recharts — huge chunk (~100KB), only needed on this page
const AreaChart = dynamic(() => import('recharts').then(m => m.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(m => m.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(m => m.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(m => m.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(m => m.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(m => m.Cell), { ssr: false });

const COLORS = ['#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#f43f5e'];
const AVATAR_COLORS = [
  'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400',
  'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400',
];

function inisial(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}

export default function DashboardPage() {
  const { resolved } = useTheme();
  const isDark = resolved === 'dark';
  const [summary, months, cashiers, sales, promos] = useQueries({ queries: [
    { queryKey: ['dashboard'], queryFn: dashboardApi.summary },
    { queryKey: ['dashboard-months'], queryFn: dashboardApi.revenueByMonth },
    { queryKey: ['dashboard-cashiers'], queryFn: dashboardApi.revenueByCashier },
    { queryKey: ['dashboard-sales'], queryFn: dashboardApi.membershipSales },
    { queryKey: ['dashboard-promos'], queryFn: dashboardApi.mostUsedPromotions },
  ]});
  if (summary.isLoading) return <><PageHeader title="Dashboard" /><SkeletonList count={5} /></>;
  const d = summary.data;
  const today = new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date());
  const smallCards = [
    { label: 'Revenue bulan ini', value: formatRupiah(d?.revenue.monthly.amount), Icon: CalendarCheck, color: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400' },
    { label: 'Total order', value: d?.summary.totalOrders ?? 0, Icon: ListChecks, color: 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400' },
    { label: 'Member aktif', value: d?.summary.activeMemberships ?? 0, Icon: Users, color: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' },
  ];
  const chartData = [...(months.data || [])].reverse().map((x) => ({ name: formatBulan(x.month), revenue: Number(x.totalRevenue) }));
  const tickColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const tooltipStyle = { backgroundColor: isDark ? '#1e293b' : '#fff', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, borderRadius: 12, fontSize: 12 };
  const tooltipLabelStyle = { color: isDark ? '#e2e8f0' : '#334155', fontWeight: 600 };

  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="space-y-5 p-4">
        {/* Greeting */}
        <div>
          <h2 className="text-xl font-bold">Halo, Admin 👋</h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{today}</p>
        </div>

        {/* Hero card — revenue hari ini */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-600 p-5 shadow-lg shadow-sky-500/25">
          <TrendUp size={120} weight="duotone" className="absolute -right-4 -top-4 text-white/20" />
          <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <p className="text-xs font-medium text-white/80">Revenue hari ini</p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-white">{formatRupiah(d?.revenue.daily.amount)}</p>
          <p className="mt-1 text-xs text-white/70">{d?.revenue.daily.count ?? 0} transaksi</p>
        </section>

        {/* Tiga metrik kecil */}
        <div className="grid grid-cols-3 gap-3">
          {smallCards.map((c) => <div key={c.label} className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-sm">
            <div className={`mb-2.5 flex h-8 w-8 items-center justify-center rounded-xl ${c.color}`}><c.Icon size={16} weight="duotone" /></div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{c.label}</p>
            <p className="mt-0.5 truncate text-sm font-bold tabular-nums">{c.value}</p>
          </div>)}
        </div>

        <section className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <h2 className="mb-4 font-semibold">Revenue per bulan</h2>
          {chartData.length ? (
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" fontSize={11} tick={{ fill: tickColor }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip formatter={(v) => formatRupiah(Number(v))} contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} cursor={{ stroke: '#0ea5e9', strokeOpacity: 0.3 }} />
                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#revGradient)"
                  dot={false} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : <p className="py-12 text-center text-sm text-slate-400">Belum ada data revenue</p>}
        </section>

        <section className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <h2 className="mb-4 font-semibold">Revenue per kasir</h2>
          <div className="space-y-3.5">
            {(cashiers.data || []).slice(0, 5).map((x, i) => (
              <div key={x.staffId} className="flex items-center gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                  {inisial(x.fullName)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{x.fullName}</p>
                  <p className="text-xs text-slate-400">{x.orderCount} order selesai</p>
                </div>
                <b className="shrink-0 text-sm tabular-nums">{formatRupiah(x.totalRevenue)}</b>
              </div>
            ))}
            {!cashiers.data?.length && <p className="text-sm text-slate-400">Belum ada data kasir</p>}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <h2 className="mb-3 font-semibold">Penjualan membership</h2>
          <div className="flex items-center gap-4">
            <div className="relative h-36 w-36 shrink-0">
              {sales.data?.byTier?.length ? (
                <>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={sales.data.byTier} dataKey="total" nameKey="tierName" innerRadius="55%" outerRadius="100%" paddingAngle={2} strokeWidth={0}>
                        {sales.data.byTier.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => formatRupiah(Number(v))} contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[10px] text-slate-400">Total</p>
                    <p className="text-sm font-bold tabular-nums">{formatRupiah(sales.data.totalSales.amount)}</p>
                  </div>
                </>
              ) : <div className="flex h-full items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-400">Kosong</div>}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              {(sales.data?.byTier || []).map((t, i) => (
                <div key={t.tierName} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="min-w-0 flex-1 truncate text-slate-600 dark:text-slate-300">{t.tierName}</span>
                  <b className="shrink-0 tabular-nums">{formatRupiah(t.total)}</b>
                </div>
              ))}
              <p className="pt-1 text-xs text-slate-400">{sales.data?.totalSales.count || 0} transaksi</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <h2 className="mb-4 font-semibold">Promo terpopuler</h2>
          <div className="space-y-3">{(promos.data || []).slice(0, 5).map((p) => <div key={p.code} className="flex items-center justify-between"><div><span className="rounded-full bg-sky-50 dark:bg-sky-950 px-2 py-1 text-xs font-bold text-sky-600 dark:text-sky-400">{p.code}</span><span className="ml-2 text-sm">{p.name}</span></div><b className="text-sm tabular-nums">{p.usage_count}×</b></div>)}{!promos.data?.length && <p className="text-sm text-slate-400">Belum ada promo digunakan</p>}</div>
        </section>
      </div>
    </>
  );
}
