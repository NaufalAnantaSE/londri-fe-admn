'use client';
import Link from 'next/link';
import PageHeader from '@/components/page-header';
import { House, Users, ShieldCheck, TShirt, Crown, Tag, QrCode } from '@phosphor-icons/react';

const modules = [
  { href: '/branches', label: 'Cabang', desc: 'Kelola cabang laundry', Icon: House },
  { href: '/staffs', label: 'Staff', desc: 'Akun kasir & karyawan', Icon: Users },
  { href: '/staff-roles', label: 'Role Staff', desc: 'Hak akses staff', Icon: ShieldCheck },
  { href: '/services', label: 'Layanan', desc: 'Jenis cucian & harga', Icon: TShirt },
  { href: '/membership-tiers', label: 'Tier Membership', desc: 'Paket member', Icon: Crown },
  { href: '/promotions', label: 'Promo', desc: 'Kode diskon', Icon: Tag },
  { href: '/attendance', label: 'Presensi', desc: 'QR & log absensi', Icon: QrCode },
];

export default function MasterPage() {
  return (
    <>
      <PageHeader title="Master Data" />
      <div className="space-y-3 p-4">
        {modules.map((m) => (
          <Link key={m.href} href={m.href}
            className="flex items-center gap-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm active:bg-slate-50">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400"><m.Icon size={22} weight="duotone" /></div>
            <div className="flex-1">
              <p className="font-semibold">{m.label}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{m.desc}</p>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5 text-slate-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </>
  );
}
