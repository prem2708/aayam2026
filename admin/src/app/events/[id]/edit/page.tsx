'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Info, IndianRupee, Gift } from 'lucide-react';
import { adminFetch, AdminEvent } from '@/lib/api';
import { ImageUpload } from '@/components/ImageUpload';
import { RichTextEditor } from '@/components/RichTextEditor';

const categories = ['technical', 'cultural', 'gaming', 'workshop', 'hackathon'];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditEventPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [poster, setPoster] = useState({ url: '', fileId: '' });
  const [banner, setBanner] = useState({ url: '', fileId: '' });
  const [paymentQr, setPaymentQr] = useState({ url: '', fileId: '' });
  const [isPaid, setIsPaid] = useState(false);

  const [prizesList, setPrizesList] = useState<{ position: string; amount: string }[]>([]);

  const addPrizeRow = () => setPrizesList([...prizesList, { position: '', amount: '' }]);
  const removePrizeRow = (index: number) => setPrizesList(prizesList.filter((_, i) => i !== index));
  const updatePrizeRow = (index: number, field: 'position' | 'amount', value: string) => {
    const newList = [...prizesList];
    newList[index][field] = value;
    setPrizesList(newList);
  };

  const { data: res, isLoading } = useQuery({
    queryKey: ['admin-event', id],
    queryFn: () => adminFetch<AdminEvent>(`/events/${id}`),
  });
  const event = res?.data;

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      title: '', category: 'technical', description: '', rules: '', venue: '', whatsapp_link: '',
      event_start_at: '', event_end_at: '', reg_start_at: '', reg_end_at: '',
      is_team_event: false, min_team_size: 1, max_team_size: 4, status: 'draft',
      is_featured: false, requires_approval: false, allow_cancellation: true,
      participant_cap: '', per_person_amount: '',
      bank_name: '', bank_account_no: '', bank_ifsc: '', bank_recipient_name: '',
    },
  });

  const isTeam = watch('is_team_event');
  const minTeamSize = Number(watch('min_team_size')) || 1;
  const maxTeamSize = Number(watch('max_team_size')) || 1;
  const perPersonAmount = Number(watch('per_person_amount')) || 0;

  const formatToDatetimeLocal = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const formatToIso = (dateStr: string) => {
    if (!dateStr || !dateStr.trim()) return '';
    const d = new Date(dateStr);
    return !isNaN(d.getTime()) ? d.toISOString() : '';
  };

  useEffect(() => {
    if (event) {
      setPoster({ url: event.poster_url || '', poster_file_id: event.poster_file_id || '' } as any);
      setBanner({ url: event.banner_url || '', banner_file_id: event.banner_file_id || '' } as any);
      setPaymentQr({ url: event.payment_qr_url || '', payment_qr_file_id: event.payment_qr_file_id || '' } as any);

      // Detect paid: has payment_qr OR bank_name OR per_person_amount
      const wasPaid = !!(event.payment_qr_url || event.bank_name || (event as any).per_person_amount);
      setIsPaid(wasPaid);

      reset({
        title: event.title,
        category: event.category,
        description: event.description,
        rules: event.rules || '',
        venue: event.venue || '',
        whatsapp_link: event.whatsapp_link || '',
        event_start_at: formatToDatetimeLocal(event.event_start_at),
        event_end_at: formatToDatetimeLocal(event.event_end_at),
        reg_start_at: formatToDatetimeLocal(event.reg_start_at),
        reg_end_at: formatToDatetimeLocal(event.reg_end_at),
        is_team_event: event.is_team_event,
        min_team_size: event.min_team_size ?? 1,
        max_team_size: event.max_team_size,
        status: event.status,
        is_featured: event.is_featured,
        requires_approval: event.requires_approval,
        allow_cancellation: event.allow_cancellation,
        participant_cap: event.participant_cap ? String(event.participant_cap) : '',
        per_person_amount: (event as any).per_person_amount != null ? String((event as any).per_person_amount) : '',
        bank_name: event.bank_name || '',
        bank_account_no: event.bank_account_no || '',
        bank_ifsc: event.bank_ifsc || '',
        bank_recipient_name: event.bank_recipient_name || '',
      });

      if (event.prizes && typeof event.prizes === 'object') {
        const list = Object.entries(event.prizes).map(([position, amount]) => ({ position, amount: String(amount) }));
        setPrizesList(list.length > 0 ? list : [
          { position: '1st Place', amount: '' },
          { position: '2nd Place', amount: '' },
          { position: '3rd Place', amount: '' },
        ]);
      } else {
        setPrizesList([
          { position: '1st Place', amount: '' },
          { position: '2nd Place', amount: '' },
          { position: '3rd Place', amount: '' },
        ]);
      }
    }
  }, [event, reset]);

  async function onSubmit(data: Record<string, any>) {
    setSubmitting(true);
    try {
      const prizesRecord: Record<string, string> = {};
      prizesList.forEach((item) => {
        if (item.position.trim() && item.amount.trim()) {
          prizesRecord[item.position.trim()] = item.amount.trim();
        }
      });

      const payload = {
        ...data,
        poster_url: poster.url || null,
        poster_file_id: poster.fileId || null,
        banner_url: banner.url || null,
        banner_file_id: banner.fileId || null,
        payment_qr_url: isPaid ? (paymentQr.url || null) : null,
        payment_qr_file_id: isPaid ? (paymentQr.fileId || null) : null,
        event_start_at: formatToIso(data.event_start_at),
        event_end_at: formatToIso(data.event_end_at),
        reg_start_at: formatToIso(data.reg_start_at),
        reg_end_at: formatToIso(data.reg_end_at),
        is_team_event: Boolean(data.is_team_event),
        is_featured: Boolean(data.is_featured),
        requires_approval: Boolean(data.requires_approval),
        allow_cancellation: Boolean(data.allow_cancellation),
        min_team_size: Math.max(1, Number(data.min_team_size) || 1),
        max_team_size: Math.max(1, Number(data.max_team_size)),
        participant_cap: data.participant_cap ? Math.max(0, Number(data.participant_cap)) : null,
        amount: isPaid && perPersonAmount > 0 ? perPersonAmount : null,
        per_person_amount: isPaid && data.per_person_amount !== '' ? Number(data.per_person_amount) : null,
        bank_name: isPaid ? (data.bank_name || null) : null,
        bank_account_no: isPaid ? (data.bank_account_no || null) : null,
        bank_ifsc: isPaid ? (data.bank_ifsc || null) : null,
        bank_recipient_name: isPaid ? (data.bank_recipient_name || null) : null,
        whatsapp_link: data.whatsapp_link || null,
        prizes: prizesRecord,
      };

      const res = await adminFetch(`/events/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      if (!res.success) throw new Error(res.error?.message);
      toast.success('Event updated!');
      router.push('/events');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = 'w-full rounded-lg bg-slate-900/80 border border-slate-700 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50';

  if (isLoading) return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
    </div>
  );

  if (!event) return <div className="text-slate-400">Event not found.</div>;

  return (
    <div className="max-w-3xl pb-12">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Core Info */}
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-violet-400">Basic Information</h2>
          <div><label className="text-sm text-slate-300 mb-1 block">Title</label><input {...register('title', { required: true })} className={inputClass} /></div>
          <div><label className="text-sm text-slate-300 mb-1 block">Category</label>
            <select {...register('category')} className={inputClass}>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select>
          </div>
          <div>
            <label className="text-sm text-slate-300 mb-1 block">Description</label>
            <textarea {...register('description', { required: true })} className="hidden" />
            <RichTextEditor value={watch('description')} onChange={(val) => setValue('description', val)} placeholder="Event description..." />
          </div>
          <div>
            <label className="text-sm text-slate-300 mb-1 block">Rules</label>
            <textarea {...register('rules')} className="hidden" />
            <RichTextEditor value={watch('rules')} onChange={(val) => setValue('rules', val)} placeholder="Event rules & guidelines..." />
          </div>
          <div><label className="text-sm text-slate-300 mb-1 block">Venue</label><input {...register('venue')} className={inputClass} /></div>
          <div><label className="text-sm text-slate-300 mb-1 block">WhatsApp Group Link</label><input type="url" {...register('whatsapp_link')} placeholder="https://chat.whatsapp.com/..." className={inputClass} /></div>
        </div>

        {/* Media */}
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-violet-400">Event Media</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <ImageUpload label="Event Poster (Portrait)" valueUrl={poster.url} valueFileId={poster.fileId} onChange={(url, fileId) => setPoster({ url, fileId })} folder="/posters" />
            <ImageUpload label="Event Banner (Landscape)" valueUrl={banner.url} valueFileId={banner.fileId} onChange={(url, fileId) => setBanner({ url, fileId })} folder="/banners" />
          </div>
        </div>

        {/* Schedule */}
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-violet-400">Event Schedule &amp; Registrations</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-slate-300 mb-1 block">Event Start</label><input type="datetime-local" {...register('event_start_at', { required: true })} className={inputClass} /></div>
            <div><label className="text-sm text-slate-300 mb-1 block">Event End</label><input type="datetime-local" {...register('event_end_at', { required: true })} className={inputClass} /></div>
            <div><label className="text-sm text-slate-300 mb-1 block">Reg Opens</label><input type="datetime-local" {...register('reg_start_at', { required: true })} className={inputClass} /></div>
            <div><label className="text-sm text-slate-300 mb-1 block">Reg Closes</label><input type="datetime-local" {...register('reg_end_at', { required: true })} className={inputClass} /></div>
          </div>
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex items-center gap-6">
              <span className="text-sm text-slate-400">Event Type:</span>
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="event_type" checked={!isTeam} onChange={() => { setValue('is_team_event', false); setValue('min_team_size', 1); setValue('max_team_size', 1); }} />
                Solo (1 Member)
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="event_type" checked={isTeam} onChange={() => { setValue('is_team_event', true); setValue('min_team_size', 2); setValue('max_team_size', 4); }} />
                Team Event
              </label>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer"><input type="checkbox" {...register('is_featured')} /> Featured</label>
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer"><input type="checkbox" {...register('requires_approval')} /> Requires Approval</label>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-slate-300 mb-1 block">Min Team Size</label>
              <input type="number" min={1} {...register('min_team_size')} className={inputClass} disabled={!isTeam} placeholder="Min members" />
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-1 block">Max Team Size</label>
              <input type="number" min={0} {...register('max_team_size')} className={inputClass} disabled={!isTeam} />
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-1 block">Cap (max registrations)</label>
              <input type="number" min={0} {...register('participant_cap')} className={inputClass} placeholder="Unlimited" />
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-1 block">Status</label>
              <select {...register('status')} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm text-slate-200 capitalize">
                {['draft', 'open', 'closed', 'ongoing', 'completed', 'cancelled'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Prizes */}
        <div className="glass rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-violet-400">Prizes &amp; Positions</h2>
            <button type="button" onClick={addPrizeRow} className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg bg-violet-600/20 text-violet-300 border border-violet-500/30 px-3 py-1.5 hover:bg-violet-600/30 transition-all cursor-pointer">
              <Plus className="h-3.5 w-3.5" /> Add Position
            </button>
          </div>
          {prizesList.length === 0 ? (
            <p className="text-sm text-slate-500">No prizes added yet.</p>
          ) : (
            <div className="space-y-3">
              {prizesList.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <div className="flex-1">
                    <label className="text-xs text-slate-400 mb-1 block">Position / Award</label>
                    <input type="text" placeholder="e.g. 1st Place" value={item.position} onChange={(e) => updatePrizeRow(idx, 'position', e.target.value)} className={inputClass} required />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-400 mb-1 block">Reward Amount / Value</label>
                    <input type="text" placeholder="e.g. ₹10,000" value={item.amount} onChange={(e) => updatePrizeRow(idx, 'amount', e.target.value)} className={inputClass} required />
                  </div>
                  <div className="pt-5">
                    <button type="button" onClick={() => removePrizeRow(idx)} className="rounded-lg border border-red-500/30 p-2.5 text-red-400 hover:bg-red-500/10 transition-all cursor-pointer">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment & Entry */}
        <div className="glass rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-violet-400">Payment &amp; Entry</h2>

          {/* Paid / Free Toggle */}
          <div>
            <label className="text-sm text-slate-300 mb-2 block font-medium">Entry Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsPaid(false)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  !isPaid
                    ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                    : 'border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <Gift className="h-4 w-4" /> Free Entry
              </button>
              <button
                type="button"
                onClick={() => setIsPaid(true)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  isPaid
                    ? 'bg-violet-600/20 border-violet-500/50 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                    : 'border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <IndianRupee className="h-4 w-4" /> Paid Entry
              </button>
            </div>
          </div>

          {isPaid && (
            <div className="space-y-4 pt-1 border-t border-slate-800">
              <div>
                <label className="text-sm text-slate-300 mb-1 block flex items-center gap-1.5">
                  Per Person Amount (₹)
                  <span title="Total charged = Per Person Amount × number of members" className="cursor-help">
                    <Info className="h-3.5 w-3.5 text-slate-500" />
                  </span>
                </label>
                <input type="number" step="1" min={0} {...register('per_person_amount')} className={inputClass} placeholder="e.g. 150 per person" />
                {perPersonAmount > 0 && (
                  <div className="mt-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-3 py-2 text-xs text-cyan-300 space-y-0.5">
                    <p className="font-semibold text-cyan-200 mb-1">💡 Amount Preview</p>
                    {isTeam
                      ? Array.from({ length: Math.max(0, maxTeamSize - minTeamSize + 1) }, (_, i) => minTeamSize + i).map((n) => (
                          <p key={n} className="font-mono">
                            {n} member{n > 1 ? 's' : ''} × ₹{perPersonAmount} = <span className="font-bold text-white">₹{n * perPersonAmount}</span>
                          </p>
                        ))
                      : <p className="font-mono">1 participant × ₹{perPersonAmount} = <span className="font-bold text-white">₹{perPersonAmount}</span></p>
                    }
                  </div>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <ImageUpload label="Payment QR Code" valueUrl={paymentQr.url} valueFileId={paymentQr.fileId} onChange={(url, fileId) => setPaymentQr({ url, fileId })} folder="/payment-qrs" />
                <div className="space-y-3">
                  <div><label className="text-sm text-slate-300 mb-1 block">Bank Name</label><input {...register('bank_name')} className={inputClass} placeholder="e.g. State Bank of India" /></div>
                  <div><label className="text-sm text-slate-300 mb-1 block">Account Number</label><input {...register('bank_account_no')} className={inputClass} placeholder="e.g. 10002934823" /></div>
                  <div><label className="text-sm text-slate-300 mb-1 block">IFSC Code</label><input {...register('bank_ifsc')} className={inputClass} placeholder="e.g. SBIN0001234" /></div>
                  <div><label className="text-sm text-slate-300 mb-1 block">Recipient Name</label><input {...register('bank_recipient_name')} className={inputClass} placeholder="e.g. TechFest Committee" /></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <button type="submit" disabled={submitting} className="w-full rounded-xl bg-violet-600 py-3.5 font-semibold text-white hover:bg-violet-500 disabled:opacity-50 flex items-center justify-center gap-2">
          {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
