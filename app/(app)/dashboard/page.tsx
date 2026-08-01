'use client';
import { useQueries } from '@tanstack/react-query';
import Link from 'next/link';
import { dashboardApi } from '@/lib/api';
import { formatRupiah, formatBulan } from '@/lib/utils';
import PageHeader from '@/components/page-header';
import SkeletonList from '@/components/skeleton-list';
import { useTheme } from '@/lib/theme';
import { CalendarCheck, ListChecks, Users } from '@phosphor-icons/react';
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

/* Deret kategorikal untuk pie chart. Tier membership memang kategori berbeda,
   jadi hue berbeda dibenarkan di sini — tapi tetap dijaga di dalam keluarga
   palet (198 → 220 → hijau/kuning status) alih-alih pelangi acak. */
const COLORS = ['#006591', '#505f76', '#047857', '#b45309', '#89ceff'];

/* Avatar kasir: pembeda identitas, bukan tingkatan. Memakai container tonal
   dari palet supaya tetap terbedakan tanpa memasukkan hue asing. */
const AVATAR_COLORS = [
  'bg-primary-container text-on-primary-container',
  'bg-secondary-container text-on-secondary-container',
  'bg-success-container text-on-success-container',
  'bg-warning-container text-on-warning-container',
  'bg-tertiary-fixed text-on-tertiary-fixed',
];

function inisial(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}

function sapaan() {
  const h = new Date().getHours();
  if (h < 11) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  if (h < 18) return 'Selamat sore';
  return 'Selamat malam';
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
    { label: 'Revenue bulan ini', value: formatRupiah(d?.revenue.monthly.amount), Icon: CalendarCheck, color: 'bg-primary-container text-on-primary-container' },
    { label: 'Total order', value: d?.summary.totalOrders ?? 0, Icon: ListChecks, color: 'bg-secondary-container text-on-secondary-container' },
    { label: 'Member aktif', value: d?.summary.activeMemberships ?? 0, Icon: Users, color: 'bg-success-container text-on-success-container' },
  ];
  const chartData = [...(months.data || [])].reverse().map((x) => ({ name: formatBulan(x.month), revenue: Number(x.totalRevenue) }));
  const tickColor = isDark ? '#bec8d2' : '#3e4850';
  const gridColor = isDark ? '#3e4850' : '#f2f3ff';
  const tooltipStyle = { backgroundColor: isDark ? '#2a3040' : '#ffffff', border: `1px solid ${isDark ? '#3e4850' : '#e2e8f0'}`, borderRadius: 12, fontSize: 12 };
  const tooltipLabelStyle = { color: isDark ? '#eef0ff' : '#151b2b', fontWeight: 600 };

  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="space-y-5 p-4">
        {/* Greeting */}
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface dark:text-inverse-on-surface">{sapaan()}, Admin</h2>
          <p className="mt-0.5 font-label-md text-label-md text-on-surface-variant dark:text-outline-variant">{today}</p>
        </div>

        {/* Hero card — revenue hari ini */}
        {/* Hero — satu-satunya blok bertinta penuh di halaman. Solid, bukan
            gradient, dan tanpa glow berwarna: DESIGN.md § Elevation meminta
            hierarki dari warna dan garis, bukan dari bayangan. */}
        <section className="relative overflow-hidden rounded-xl bg-primary p-5">
          <p className="font-label-md text-label-md text-on-primary/80">Revenue hari ini</p>
          <p className="mt-1 font-display text-display tabular-nums text-on-primary">{formatRupiah(d?.revenue.daily.amount)}</p>
          <p className="mt-1 font-label-md text-label-md text-on-primary/70">{d?.revenue.daily.count ?? 0} transaksi selesai hari ini</p>
        </section>

        {/* Tiga metrik kecil */}
        <div className="grid grid-cols-3 gap-3">
          {smallCards.map((c) => <div key={c.label} className="rounded-xl border border-border-subtle dark:border-outline-variant/20 glass p-3.5 shadow-card">
            <div className={`mb-2.5 flex h-8 w-8 items-center justify-center rounded-xl ${c.color}`}><c.Icon size={16} weight="duotone" /></div>
            <p className="font-label-md text-label-md text-on-surface-variant dark:text-outline-variant">{c.label}</p>
            <p className="mt-0.5 truncate font-data-tabular text-data-tabular font-bold tabular-nums text-on-surface dark:text-inverse-on-surface">{c.value}</p>
          </div>)}
        </div>

        <section className="rounded-xl border border-border-subtle dark:border-outline-variant/20 glass p-md shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-headline-md text-headline-md text-on-surface dark:text-inverse-on-surface">Revenue per bulan</h2>
            <Link href="/reports" className="font-label-md text-label-md font-medium text-primary dark:text-inverse-primary active:opacity-70">Laporan lengkap →</Link>
          </div>
          {chartData.length ? (
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#006591" stopOpacity={0.30} />
                    <stop offset="100%" stopColor="#006591" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" fontSize={11} tick={{ fill: tickColor }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip formatter={(v) => formatRupiah(Number(v))} contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} cursor={{ stroke: '#006591', strokeOpacity: 0.3 }} />
                <Area type="monotone" dataKey="revenue" stroke="#006591" strokeWidth={2.5} fill="url(#revGradient)"
                  dot={false} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : <p className="py-12 text-center font-body-md text-body-md text-outline">Belum ada data revenue</p>}
        </section>

        <section className="rounded-xl border border-border-subtle dark:border-outline-variant/20 glass p-md shadow-card">
          <h2 className="mb-4 font-headline-md text-headline-md text-on-surface dark:text-inverse-on-surface">Revenue per kasir</h2>
          <div className="space-y-3.5">
            {(cashiers.data || []).slice(0, 5).map((x, i) => (
              <div key={x.staffId} className="flex items-center gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                  {inisial(x.fullName)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{x.fullName}</p>
                  <p className="font-label-md text-label-md text-outline dark:text-outline-variant">{x.orderCount} order selesai</p>
                </div>
                <b className="shrink-0 text-sm tabular-nums">{formatRupiah(x.totalRevenue)}</b>
              </div>
            ))}
            {!cashiers.data?.length && <p className="font-body-md text-body-md text-outline">Belum ada data kasir</p>}
          </div>
        </section>

        <section className="rounded-xl border border-border-subtle dark:border-outline-variant/20 glass p-md shadow-card">
          <h2 className="mb-3 font-headline-md text-headline-md text-on-surface dark:text-inverse-on-surface">Penjualan membership</h2>
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
                    <p className="font-label-md text-label-md text-outline dark:text-outline-variant">Total</p>
                    <p className="text-sm font-bold tabular-nums">{formatRupiah(sales.data.totalSales.amount)}</p>
                  </div>
                </>
              ) : <div className="flex h-full items-center justify-center rounded-full bg-surface-container dark:bg-white/10 font-label-md text-label-md text-outline">Kosong</div>}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              {(sales.data?.byTier || []).map((t, i) => (
                <div key={t.tierName} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="min-w-0 flex-1 truncate text-on-surface-variant dark:text-outline-variant">{t.tierName}</span>
                  <b className="shrink-0 tabular-nums">{formatRupiah(t.total)}</b>
                </div>
              ))}
              <p className="pt-1 font-label-md text-label-md text-outline dark:text-outline-variant">{sales.data?.totalSales.count || 0} transaksi</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border-subtle dark:border-outline-variant/20 glass p-md shadow-card">
          <h2 className="mb-4 font-headline-md text-headline-md text-on-surface dark:text-inverse-on-surface">Promo terpopuler</h2>
          <div className="space-y-3">{(promos.data || []).slice(0, 5).map((p) => <div key={p.code} className="flex items-center justify-between"><div><span className="chip chip-info font-bold">{p.code}</span><span className="ml-2 text-sm">{p.name}</span></div><b className="text-sm tabular-nums">{p.usage_count}×</b></div>)}{!promos.data?.length && <p className="font-body-md text-body-md text-outline">Belum ada promo digunakan</p>}</div>
        </section>
      </div>
    </>
  );
}
