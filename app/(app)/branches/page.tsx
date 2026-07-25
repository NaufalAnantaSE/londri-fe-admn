'use client';
import CrudPage from '@/components/crud-page';
import CardActions from '@/components/card-actions';
import type { Branch } from '@/lib/types';

export default function BranchesPage() {
  return (
    <CrudPage<Branch>
      title="Cabang" endpoint="/branches" queryKey="branches" searchPlaceholder="Cari cabang…"
      initialForm={{ name: '', address: '', phoneNumber: '' }}
      fields={[
        { name: 'name', label: 'Nama Cabang', placeholder: 'Londri Cabang Bandung', required: true },
        { name: 'address', label: 'Alamat', type: 'textarea', placeholder: 'Jl. …', required: true },
        { name: 'phoneNumber', label: 'No. Telepon', placeholder: '0812…', required: true },
      ]}
      validate={(f): Record<string, string> => {
        const e: Record<string, string> = {};
        if (!f.name) e.name = 'Nama wajib diisi';
        if (!f.address) e.address = 'Alamat wajib diisi';
        if (!f.phoneNumber) e.phoneNumber = 'Telepon wajib diisi';
        return e;
      }}
      fromItem={(b) => ({ name: b.name, address: b.address, phoneNumber: b.phoneNumber })}
      renderCard={(b, { edit, remove }) => (
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold">{b.name}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{b.address}</p>
              <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{b.phoneNumber}</p>
            </div>
            <CardActions onEdit={edit} onRemove={remove} />
          </div>
        </div>
      )}
    />
  );
}
