'use client';
import { useRouter } from 'next/navigation';

export default function Fab({ href, onClick }: { href?: string; onClick?: () => void }) {
  const router = useRouter();
  return (
    <button
      onClick={onClick || (() => href && router.push(href))}
      aria-label="Tambah"
      className="fixed bottom-24 right-[max(1rem,calc(50%-14rem+1rem))] z-40 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-3xl text-white shadow-lg shadow-sky-500/30 active:bg-sky-600 dark:bg-sky-600 dark:shadow-sky-600/30 dark:active:bg-sky-700"
      style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      +
    </button>
  );
}
