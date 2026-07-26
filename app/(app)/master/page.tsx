'use client';
import Link from 'next/link';
import PageHeader from '@/components/page-header';
import { House, Users, ShieldCheck, TShirt, Crown, Tag, QrCode, ChartLineUp, CaretRight } from '@phosphor-icons/react';

const modules = [
  { href: '/reports', label: 'Laporan', desc: 'Statistik & ekspor CSV/Excel/PDF', Icon: ChartLineUp, color: 'bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400' },
  { href: '/branches', label: 'Cabang', desc: 'Kelola cabang laundry', Icon: House, color: 'bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400' },
  { href: '/staffs', label: 'Staff', desc: 'Akun kasir & karyawan', Icon: Users, color: 'bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400' },
  { href: '/staff-roles', label: 'Role Staff', desc: 'Hak akses staff', Icon: ShieldCheck, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
  { href: '/services', label: 'Layanan', desc: 'Jenis cucian & harga', Icon: TShirt, color: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400' },
  { href: '/membership-tiers', label: 'Tier Membership', desc: 'Paket member', Icon: Crown, color: 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400' },
  { href: '/promotions', label: 'Promo', desc: 'Kode diskon', Icon: Tag, color: 'bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-400' },
  { href: '/attendance', label: 'Presensi', desc: 'QR & log absensi', Icon: QrCode, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' },
];

export default function MasterPage() {
  return (
    <>
      <PageHeader title="Master Data" />
      <div className="space-y-3 p-4">
        {modules.map((m) => (
          <Link key={m.href} href={m.href}
            className="flex items-center gap-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 glass p-4 shadow-sm transition-transform duration-150 active:scale-[0.98]">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl p-2.5 ${m.color}`}><m.Icon size={22} weight="duotone" /></div>
            <div className="flex-1">
              <p className="font-semibold">{m.label}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{m.desc}</p>
            </div>
            <CaretRight size={20} className="text-slate-300 dark:text-slate-600" />
          </Link>
        ))}
      </div>
    </>
  );
}
