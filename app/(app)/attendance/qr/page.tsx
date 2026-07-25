'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import QRCode from 'qrcode';
import PageHeader from '@/components/page-header';
import Field, { inputCls } from '@/components/field';
import { attendanceApi, branchesApi } from '@/lib/api';
import { apiMessage } from '@/lib/api/client';
import { formatTanggal } from '@/lib/utils';
import { toast } from '@/hooks/useToast';
import type { AttendanceQrCode } from '@/lib/types';

export default function AttendanceQrPage() {
  const qc = useQueryClient();
  const [branchId, setBranchId] = useState('');
  const [validHours, setValidHours] = useState('8');
  const [qrImage, setQrImage] = useState('');
  const [generated, setGenerated] = useState<AttendanceQrCode | null>(null);

  const { data: branches } = useQuery({ queryKey: ['branches-all'], queryFn: () => branchesApi.list({ limit: 100 }) });
  const { data: qrCodes } = useQuery({ queryKey: ['attendance-qr'], queryFn: attendanceApi.qrCodes });

  const create = useMutation({
    mutationFn: () => attendanceApi.createQr(branchId, Number(validHours)),
    onSuccess: async (qr) => {
      setGenerated(qr);
      setQrImage(await QRCode.toDataURL(qr.qrToken, { width: 480, margin: 2 }));
      qc.invalidateQueries({ queryKey: ['attendance-qr'] });
      toast.success('QR presensi dibuat');
    },
    onError: (e) => toast.error(apiMessage(e)),
  });

  useEffect(() => { setGenerated(null); setQrImage(''); }, [branchId]);

  return (
    <>
      <PageHeader title="QR Presensi" back />
      <div className="space-y-5 p-4">
        <section className="space-y-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <Field label="Cabang">
            <select value={branchId} onChange={(e) => setBranchId(e.target.value)} className={inputCls}>
              <option value="">— Pilih cabang —</option>
              {(branches?.items || []).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </Field>
          <Field label="Berlaku (jam)">
            <input type="number" min={1} max={24} value={validHours} onChange={(e) => setValidHours(e.target.value)} className={inputCls} />
          </Field>
          <button onClick={() => create.mutate()} disabled={!branchId || create.isPending}
            className="min-h-[48px] w-full rounded-xl bg-sky-500 font-semibold text-white active:bg-sky-600 disabled:opacity-50">
            {create.isPending ? 'Membuat…' : 'Generate QR'}
          </button>
        </section>

        {generated && qrImage && (
          <section className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center shadow-sm">
            <p className="text-sm text-slate-500 dark:text-slate-400">Scan QR ini untuk presensi di</p>
            <p className="mt-1 text-lg font-bold">{generated.branch?.name || (branches?.items || []).find((b) => b.id === generated.branchId)?.name}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrImage} alt="QR Presensi" className="mx-auto my-5 w-64 rounded-xl" />
            <p className="break-all rounded-lg bg-slate-50 dark:bg-slate-800 p-2 text-[11px] text-slate-400 dark:text-slate-500">{generated.qrToken}</p>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Berlaku: {formatTanggal(generated.validFrom, true)} — {formatTanggal(generated.validUntil, true)}
            </p>
          </section>
        )}

        <section>
          <h2 className="mb-3 font-semibold">QR Aktif Sebelumnya</h2>
          <div className="space-y-2">
            {qrCodes?.map((qr) => (
              <div key={qr.id} className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
                <p className="font-medium">{qr.branch?.name}</p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  {formatTanggal(qr.validFrom, true)} — {formatTanggal(qr.validUntil, true)}
                </p>
              </div>
            ))}
            {!qrCodes?.length && <p className="text-sm text-slate-400 dark:text-slate-500">Belum ada QR dibuat.</p>}
          </div>
        </section>
      </div>
    </>
  );
}
