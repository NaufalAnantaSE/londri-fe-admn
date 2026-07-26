'use client';
import CrudPage from '@/components/crud-page';
import type { StaffRole } from '@/lib/types';
import CardActions from '@/components/card-actions';

export default function StaffRolesPage() {
  return (
    <CrudPage<StaffRole>
      title="Role Staff" endpoint="/staff-roles" queryKey="staff-roles" searchPlaceholder="Cari role…"
      initialForm={{ name: '', description: '' }}
      fields={[
        { name: 'name', label: 'Nama Role', placeholder: 'Cashier', required: true },
        { name: 'description', label: 'Deskripsi', type: 'textarea', placeholder: 'Kasir cabang' },
      ]}
      validate={(f): Record<string, string> => (!f.name ? { name: 'Nama wajib diisi' } : {})}
      fromItem={(r) => ({ name: r.name, description: r.description || '' })}
      renderCard={(r, { edit, remove }) => (
        <div className="flex items-start justify-between gap-2 rounded-2xl border border-slate-100 dark:border-slate-800 glass p-4 shadow-sm">
          <div>
            <p className="font-semibold">{r.name}</p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{r.description || '—'}</p>
          </div>
          <CardActions onEdit={edit} onRemove={remove} />
        </div>
      )}
    />
  );
}
