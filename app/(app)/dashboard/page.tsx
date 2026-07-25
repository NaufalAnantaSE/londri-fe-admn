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
const BarChart = dynamic(() => import('recharts').then(m => m.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(m => m.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(m => m.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(m => m.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(m => m.Cell), { ssr: false });

const COLORS = ['#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#f43f5e'];

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
  const cards = [
    { label: 'Revenue hari ini', value: formatRupiah(d?.revenue.daily.amount), Icon: TrendUp, color: 'bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400' },
    { label: 'Revenue bulan ini', value: formatRupiah(d?.revenue.monthly.amount), Icon: CalendarCheck, color: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400' },
    { label: 'Total order', value: d?.summary.totalOrders ?? 0, Icon: ListChecks, color: 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400' },
    { label: 'Member aktif', value: d?.summary.activeMemberships ?? 0, Icon: Users, color: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' },
  ];
  const chartData = [...(months.data || [])].reverse().map((x) => ({ name: formatBulan(x.month), revenue: Number(x.totalRevenue) }));
  const tickColor = isDark ? '#94a3b8' : '#94a3b8';
  const tooltipStyle = { backgroundColor: isDark ? '#1e293b' : '#fff', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, borderRadius: 12, fontSize: 12 };
  const tooltipLabelStyle = { color: isDark ? '#e2e8f0' : '#334155', fontWeight: 600 };

  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="space-y-5 p-4">
        <div className="grid grid-cols-2 gap-3">
          {cards.map((c) => <div key={c.label} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${c.color}`}><c.Icon size={18} weight="duotone" /></div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{c.label}</p><p className="mt-1 text-lg font-bold">{c.value}</p>
          </div>)}
        </div>
        <section className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <h2 className="mb-4 font-semibold">Revenue per bulan</h2>
          {chartData.length ? (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" fontSize={11} tick={{ fill: tickColor }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip formatter={(v) => formatRupiah(Number(v))} contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} cursor={{ fill: isDark ? '#334155' : '#f1f5f9' }} />
                <Bar dataKey="revenue" fill="#0ea5e9" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="py-12 text-center text-sm text-slate-400">Belum ada data revenue</p>}
        </section>
        <section className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <h2 className="mb-4 font-semibold">Revenue per kasir</h2>
          <div className="space-y-3">{(cashiers.data || []).slice(0, 5).map((x) => <div key={x.staffId} className="flex items-center justify-between"><div><p className="text-sm font-medium">{x.fullName}</p><p className="text-xs text-slate-400">{x.orderCount} order selesai</p></div><b className="text-sm">{formatRupiah(x.totalRevenue)}</b></div>)}{!cashiers.data?.length && <p className="text-sm text-slate-400">Belum ada data kasir</p>}</div>
        </section>
        <section className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <h2 className="mb-3 font-semibold">Penjualan membership</h2>
          <div className="flex items-center gap-4">
            <div className="h-32 w-32">{sales.data?.byTier?.length ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={sales.data.byTier} dataKey="total" nameKey="tierName" innerRadius={35} outerRadius={55}>
                    {sales.data.byTier.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatRupiah(Number(v))} contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="flex h-full items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-400">Kosong</div>}</div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total penjualan</p>
              <p className="text-xl font-bold">{formatRupiah(sales.data?.totalSales.amount)}</p>
              <p className="text-xs text-slate-400">{sales.data?.totalSales.count || 0} transaksi</p>
            </div>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <h2 className="mb-4 font-semibold">Promo terpopuler</h2>
          <div className="space-y-3">{(promos.data || []).slice(0, 5).map((p) => <div key={p.code} className="flex items-center justify-between"><div><span className="rounded-md bg-sky-50 dark:bg-sky-950 px-2 py-1 text-xs font-bold text-sky-600 dark:text-sky-400">{p.code}</span><span className="ml-2 text-sm">{p.name}</span></div><b className="text-sm">{p.usage_count}×</b></div>)}{!promos.data?.length && <p className="text-sm text-slate-400">Belum ada promo digunakan</p>}</div>
        </section>
      </div>
    </>
  );
}
