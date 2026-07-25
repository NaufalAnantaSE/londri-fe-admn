'use client';
import CrudPage from '@/components/crud-page';
import { useQuery } from '@tanstack/react-query';
import { branchesApi, staffRolesApi } from '@/lib/api';
import type { Staff } from '@/lib/types';
import CardActions from '@/components/card-actions';

export default function StaffsPage() {
  const { data: branches } = useQuery({ queryKey: ['branches-all'], queryFn: () => branchesApi.list({ limit: 100 }) });
  const { data: roles } = useQuery({ queryKey: ['roles-all'], queryFn: () => staffRolesApi.list({ limit: 100 }) });

  return (
    <CrudPage<Staff>
      title="Staff" endpoint="/staffs" queryKey="staffs" searchPlaceholder="Cari staff…"
      initialForm={{ fullName: '', username: '', password: '', branchId: '', roleId: '', phoneNumber: '', address: '', isActive: true }}
      fields={[
        { name: 'fullName', label: 'Nama Lengkap', required: true },
        { name: 'username', label: 'Username', required: true },
        { name: 'password', label: 'Password', type: 'password', placeholder: 'Kosongkan jika tidak diubah' },
        { name: 'branchId', label: 'Cabang', type: 'select', required: true, options: (branches?.items || []).map((b) => ({ value: b.id, label: b.name })) },
        { name: 'roleId', label: 'Role', type: 'select', required: true, options: (roles?.items || []).map((r) => ({ value: r.id, label: r.name })) },
        { name: 'phoneNumber', label: 'No. Telepon' },
        { name: 'address', label: 'Alamat', type: 'textarea' },
        { name: 'isActive', label: 'Aktif', type: 'switch' },
      ]}
      validate={(f, isEditing): Record<string, string> => {
        const e: Record<string, string> = {};
        if (!f.fullName) e.fullName = 'Nama wajib diisi';
        if (!f.username) e.username = 'Username wajib diisi';
        if (!isEditing && (!f.password || String(f.password).length < 6)) e.password = 'Password wajib (min 6 karakter)';
        if (!f.branchId) e.branchId = 'Cabang wajib dipilih';
        if (!f.roleId) e.roleId = 'Role wajib dipilih';
        return e;
      }}
      toPayload={(f, isEditing) => {
        const payload: Record<string, unknown> = {
          fullName: f.fullName, username: f.username, branchId: f.branchId, roleId: f.roleId,
          phoneNumber: f.phoneNumber || null, address: f.address || null, isActive: !!f.isActive,
        };
        if (!isEditing || f.password) payload.password = f.password;
        return payload;
      }}
      fromItem={(s) => ({ fullName: s.fullName, username: s.username, password: '', branchId: s.branchId, roleId: s.roleId, phoneNumber: s.phoneNumber || '', address: s.address || '', isActive: s.isActive })}
      renderCard={(s, { edit, remove }) => (
        <div className="flex items-start justify-between gap-2 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{s.fullName}</p>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${s.isActive ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-500'}`}>
                {s.isActive ? 'AKTIF' : 'NONAKTIF'}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">@{s.username} · {s.role?.name}</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">{s.branch?.name}</p>
          </div>
          <CardActions onEdit={edit} onRemove={remove} />
        </div>
      )}
    />
  );
}
