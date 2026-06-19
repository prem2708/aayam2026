'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { adminFetch } from '@/lib/api';
import { ImageUpload } from '@/components/ImageUpload';
import { RichTextEditor } from '@/components/RichTextEditor';

const categories = ['technical', 'cultural', 'gaming', 'workshop', 'hackathon'];

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [poster, setPoster] = useState({ url: '', fileId: '' });
  const [banner, setBanner] = useState({ url: '', fileId: '' });
  const [paymentQr, setPaymentQr] = useState({ url: '', fileId: '' });

  const [prizesList, setPrizesList] = useState<{ position: string; amount: string }[]>([
    { position: '1st Place', amount: '' },
    { position: '2nd Place', amount: '' },
    { position: '3rd Place', amount: '' },
  ]);

  const addPrizeRow = () => {
    setPrizesList([...prizesList, { position: '', amount: '' }]);
  };

  const removePrizeRow = (index: number) => {
    setPrizesList(prizesList.filter((_, i) => i !== index));
  };

  const updatePrizeRow = (index: number, field: 'position' | 'amount', value: string) => {
    const newList = [...prizesList];
    newList[index][field] = value;
    setPrizesList(newList);
  };

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      title: '', category: 'technical', description: '', rules: '', venue: '', whatsapp_link: '',
      event_start_at: '', event_end_at: '', reg_start_at: '', reg_end_at: '',
      is_team_event: false, min_team_size: 1, max_team_size: 4, status: 'draft',
      is_featured: false, requires_approval: false, allow_cancellation: true, participant_cap: '', amount: '',
      bank_name: '', bank_account_no: '', bank_ifsc: '', bank_recipient_name: '',
    },
  });

  const isTeam = watch('is_team_event');

  const formatToIso = (dateStr: string) => {
    if (!dateStr || !dateStr.trim()) return '';
    const d = new Date(dateStr);
    return !isNaN(d.getTime()) ? d.toISOString() : '';
  };

  async function onSubmit(data: Record<string, any>) {
    setLoading(true);
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
        payment_qr_url: paymentQr.url || null,
        payment_qr_file_id: paymentQr.fileId || null,
        event_start_at: formatToIso(data.event_start_at),
        event_end_at: formatToIso(data.event_end_at),
        reg_start_at: formatToIso(data.reg_start_at),
        reg_end_at: formatToIso(data.reg_end_at),
        is_team_event: Boolean(data.is_team_event),
        is_featured: Boolean(data.is_featured),
        requires_approval: Boolean(data.requires_approval),
        allow_cancellation: Boolean(data.allow_cancellation),
        min_team_size: 1,
        max_team_size: Math.max(0, Number(data.max_team_size)),
        participant_cap: data.participant_cap ? Math.max(0, Number(data.participant_cap)) : null,
        amount: data.amount !== undefined && data.amount !== null && data.amount !== '' ? Number(data.amount) : null,
        bank_name: data.bank_name || null,
        bank_account_no: data.bank_account_no || null,
        bank_ifsc: data.bank_ifsc || null,
        bank_recipient_name: data.bank_recipient_name || null,
        whatsapp_link: data.whatsapp_link || null,
        prizes: prizesRecord,
      };

      const res = await adminFetch('/events', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!res.success) throw new Error(res.error?.message);
      toast.success('Event created!');
      router.push('/events');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = 'w-full rounded-lg bg-slate-900/80 border border-slate-700 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50';

  return (
    <div className="max-w-3xl pb-12">
      <h1 className="text-2xl font-bold mb-6">Create Event</h1>
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
            <RichTextEditor
              value={watch('description')}
              onChange={(val) => setValue('description', val)}
              placeholder="Event description..."
            />
          </div>
          <div>
            <label className="text-sm text-slate-300 mb-1 block">Rules</label>
            <textarea {...register('rules')} className="hidden" />
            <RichTextEditor
              value={watch('rules')}
              onChange={(val) => setValue('rules', val)}
              placeholder="Event rules & guidelines..."
            />
          </div>
          <div><label className="text-sm text-slate-300 mb-1 block">Venue</label><input {...register('venue')} className={inputClass} /></div>
          <div><label className="text-sm text-slate-300 mb-1 block">WhatsApp Group Link</label><input type="url" {...register('whatsapp_link')} placeholder="https://chat.whatsapp.com/..." className={inputClass} /></div>
        </div>

        {/* Media / Images */}
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-violet-400">Event Media</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <ImageUpload label="Event Poster (Portrait)" valueUrl={poster.url} valueFileId={poster.fileId} onChange={(url, fileId) => setPoster({ url, fileId })} />
            <ImageUpload label="Event Banner (Landscape)" valueUrl={banner.url} valueFileId={banner.fileId} onChange={(url, fileId) => setBanner({ url, fileId })} />
          </div>
        </div>

        {/* Dates */}
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-violet-400">Event Schedule & Registrations</h2>
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
                <input
                  type="radio"
                  name="event_type"
                  checked={!isTeam}
                  onChange={() => {
                    setValue('is_team_event', false);
                    setValue('min_team_size', 1);
                    setValue('max_team_size', 1);
                  }}
                />
                Solo (1 Member)
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="event_type"
                  checked={isTeam}
                  onChange={() => {
                    setValue('is_team_event', true);
                    setValue('min_team_size', 1);
                    setValue('max_team_size', 4);
                  }}
                />
                Team Event
              </label>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer"><input type="checkbox" {...register('is_featured')} /> Featured</label>
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer"><input type="checkbox" {...register('requires_approval')} /> Requires Approval</label>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="text-sm text-slate-300 mb-1 block">Max Team</label><input type="number" min={0} {...register('max_team_size')} className={inputClass} disabled={!isTeam} /></div>
            <div><label className="text-sm text-slate-300 mb-1 block">Cap</label><input type="number" min={0} {...register('participant_cap')} className={inputClass} placeholder="Unlimited" /></div>
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

        {/* Prizes Section */}
        <div className="glass rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-violet-400">Prizes & Positions</h2>
            <button
              type="button"
              onClick={addPrizeRow}
              className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg bg-violet-600/20 text-violet-300 border border-violet-500/30 px-3 py-1.5 hover:bg-violet-600/30 transition-all cursor-pointer"
            >
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
                    <input
                      type="text"
                      placeholder="e.g. 1st Place"
                      value={item.position}
                      onChange={(e) => updatePrizeRow(idx, 'position', e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-400 mb-1 block">Reward Amount / Value</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹10,000"
                      value={item.amount}
                      onChange={(e) => updatePrizeRow(idx, 'amount', e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div className="pt-5">
                    <button
                      type="button"
                      onClick={() => removePrizeRow(idx)}
                      className="rounded-lg border border-red-500/30 p-2.5 text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-violet-400">Payment Details (Optional)</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <ImageUpload label="Payment QR Code" valueUrl={paymentQr.url} valueFileId={paymentQr.fileId} onChange={(url, fileId) => setPaymentQr({ url, fileId })} />
            <div className="space-y-4">
              <div><label className="text-sm text-slate-300 mb-1 block">Amount</label><input type="number" step="1" min={0} {...register('amount')} className={inputClass} placeholder="Optional" /></div>
              <div><label className="text-sm text-slate-300 mb-1 block">Bank Name</label><input {...register('bank_name')} className={inputClass} placeholder="e.g. State Bank of India" /></div>
              <div><label className="text-sm text-slate-300 mb-1 block">Account Number</label><input {...register('bank_account_no')} className={inputClass} placeholder="e.g. 10002934823" /></div>
              <div><label className="text-sm text-slate-300 mb-1 block">IFSC Code</label><input {...register('bank_ifsc')} className={inputClass} placeholder="e.g. SBIN0001234" /></div>
              <div><label className="text-sm text-slate-300 mb-1 block">Recipient Name</label><input {...register('bank_recipient_name')} className={inputClass} placeholder="e.g. TechFest Committee" /></div>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full rounded-xl bg-violet-600 py-3.5 font-semibold text-white hover:bg-violet-500 disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Event'}
        </button>
      </form>
    </div>
  );
}
