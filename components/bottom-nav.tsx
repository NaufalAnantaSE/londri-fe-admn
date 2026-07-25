'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SquaresFour, Receipt, UsersThree, Stack, GearSix } from '@phosphor-icons/react';

const items = [
  { href: '/dashboard', label: 'Dashboard', Icon: SquaresFour },
  { href: '/orders', label: 'Order', Icon: Receipt },
  { href: '/memberships', label: 'Member', Icon: UsersThree },
  { href: '/master', label: 'Master', Icon: Stack },
  { href: '/settings', label: 'Setting', Icon: GearSix },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 safe-bottom">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}
              className={`relative flex min-h-[56px] flex-col items-center justify-center gap-0.5 pt-1.5 text-[11px] transition-colors active:bg-slate-100 dark:active:bg-slate-800 ${active ? 'font-medium text-sky-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'}`}>
              <span className={`h-1 w-6 rounded-full transition-all duration-200 ${active ? 'bg-sky-500' : 'bg-transparent'}`} />
              <item.Icon size={24} weight={active ? 'fill' : 'regular'} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
