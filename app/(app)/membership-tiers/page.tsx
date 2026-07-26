'use client';
import CrudPage from '@/components/crud-page';
import { formatRupiah } from '@/lib/utils';
import type { MembershipTier } from '@/lib/types';
import CardActions from '@/components/card-actions';

export default function MembershipTiersPage() {
  return (
    <CrudPage<MembershipTier>
      title="Tier Membership" endpoint="/membership-tiers" queryKey="membership-tiers" searchPlaceholder="Cari tier…"
      initialForm={{ name: '', purchasePrice: '', balanceAmount: '', validityDays: '', description: '' }}
      fields={[
        { name: 'name', label: 'Nama Tier', placeholder: 'Silver', required: true },
        { name: 'purchasePrice', label: 'Harga Beli (Rp)', type: 'number', placeholder: '100000', required: true },
        { name: 'balanceAmount', label: 'Saldo Didapat (Rp)', type: 'number', placeholder: '120000', required: true },
        { name: 'validityDays', label: 'Masa Berlaku (hari)', type: 'number', placeholder: '30', required: true },
        { name: 'description', label: 'Deskripsi', type: 'textarea' },
      ]}
      validate={(f): Record<string, string> => {
        const e: Record<string, string> = {};
        if (!f.name) e.name = 'Nama wajib diisi';
        if (!f.purchasePrice) e.purchasePrice = 'Harga beli wajib diisi';
        if (!f.balanceAmount) e.balanceAmount = 'Saldo wajib diisi';
        if (!f.validityDays) e.validityDays = 'Masa berlaku wajib diisi';
        return e;
      }}
      toPayload={(f) => ({ name: f.name, purchasePrice: Number(f.purchasePrice), balanceAmount: Number(f.balanceAmount), validityDays: Number(f.validityDays), description: f.description || null })}
      fromItem={(t) => ({ name: t.name, purchasePrice: t.purchasePrice, balanceAmount: t.balanceAmount, validityDays: String(t.validityDays), description: t.description || '' })}
      renderCard={(t, { edit, remove }) => (
        <div className="flex items-start justify-between gap-2 rounded-2xl border border-slate-100 dark:border-slate-800 glass p-4 shadow-sm">
          <div>
            <p className="font-semibold">{t.name}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Beli {formatRupiah(t.purchasePrice)} → saldo {formatRupiah(t.balanceAmount)}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Berlaku {t.validityDays} hari</p>
          </div>
          <CardActions onEdit={edit} onRemove={remove} />
        </div>
      )}
    />
  );
}
