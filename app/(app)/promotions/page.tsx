'use client';
import CrudPage from '@/components/crud-page';
import { formatRupiah, formatTanggal } from '@/lib/utils';
import type { Promotion } from '@/lib/types';
import CardActions from '@/components/card-actions';

export default function PromotionsPage() {
  return (
    <CrudPage<Promotion>
      title="Promo" endpoint="/promotions" queryKey="promotions" searchPlaceholder="Cari promo…"
      initialForm={{ code: '', name: '', discountType: 'PERCENTAGE', discountValue: '', minimumPurchase: '0', maximumDiscount: '', startDate: '', endDate: '', isActive: true }}
      fields={[
        { name: 'code', label: 'Kode Promo', placeholder: 'DISKON10', required: true },
        { name: 'name', label: 'Nama Promo', placeholder: 'Diskon 10%', required: true },
        { name: 'discountType', label: 'Tipe Diskon', type: 'select', required: true, options: [
          { value: 'PERCENTAGE', label: 'Persentase (%)' },
          { value: 'FIXED_AMOUNT', label: 'Nominal (Rp)' },
        ]},
        { name: 'discountValue', label: 'Nilai Diskon', type: 'number', placeholder: '10', required: true },
        { name: 'minimumPurchase', label: 'Minimal Belanja (Rp)', type: 'number', placeholder: '0' },
        { name: 'maximumDiscount', label: 'Maks Diskon (Rp)', type: 'number', placeholder: 'Opsional' },
        { name: 'startDate', label: 'Mulai', type: 'date', required: true },
        { name: 'endDate', label: 'Berakhir', type: 'date', required: true },
        { name: 'isActive', label: 'Aktif', type: 'switch' },
      ]}
      validate={(f): Record<string, string> => {
        const e: Record<string, string> = {};
        if (!f.code) e.code = 'Kode wajib diisi';
        if (!f.name) e.name = 'Nama wajib diisi';
        if (!f.discountValue) e.discountValue = 'Nilai diskon wajib diisi';
        if (!f.startDate) e.startDate = 'Tanggal mulai wajib diisi';
        if (!f.endDate) e.endDate = 'Tanggal akhir wajib diisi';
        return e;
      }}
      toPayload={(f) => ({
        code: f.code, name: f.name, discountType: f.discountType, discountValue: Number(f.discountValue),
        minimumPurchase: Number(f.minimumPurchase) || 0, maximumDiscount: f.maximumDiscount ? Number(f.maximumDiscount) : null,
        startDate: f.startDate, endDate: f.endDate, isActive: !!f.isActive,
      })}
      fromItem={(p) => ({
        code: p.code, name: p.name, discountType: p.discountType, discountValue: p.discountValue,
        minimumPurchase: p.minimumPurchase, maximumDiscount: p.maximumDiscount || '',
        startDate: p.startDate.slice(0, 10), endDate: p.endDate.slice(0, 10), isActive: p.isActive,
      })}
      renderCard={(p, { edit, remove }) => (
        <div className="flex items-start justify-between gap-2 rounded-2xl border border-slate-100 dark:border-slate-800 glass p-4 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-sky-50 dark:bg-sky-950 px-2 py-1 text-xs font-bold text-sky-600">{p.code}</span>
              {!p.isActive && <span className="rounded-full bg-slate-100 dark:bg-slate-950 px-2 py-0.5 text-[10px] font-bold text-slate-400 dark:text-slate-500">NONAKTIF</span>}
            </div>
            <p className="mt-2 font-semibold">{p.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {p.discountType === 'PERCENTAGE' ? `${Number(p.discountValue)}%` : formatRupiah(p.discountValue)}
              {' '}· min. {formatRupiah(p.minimumPurchase)}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{formatTanggal(p.startDate)} – {formatTanggal(p.endDate)}</p>
          </div>
          <CardActions onEdit={edit} onRemove={remove} />
        </div>
      )}
    />
  );
}
