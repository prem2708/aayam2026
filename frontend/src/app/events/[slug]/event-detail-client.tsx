'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Trophy, Download, Loader2, X, Sparkles, CheckCircle2, Ticket, QrCode, ClipboardList, Info, Sparkle } from 'lucide-react';
import { toast } from 'sonner';
import { Event, UserProfile, apiFetch } from '@/lib/api';
import { CATEGORY_LABELS, CATEGORY_COLORS, STATUS_COLORS, formatDate, cn } from '@/lib/utils';

// Helper style matching for prize cards
const prizeStyles: Record<string, { color: string; bg: string; border: string; glow: string }> = {
  '1st': { color: 'text-amber-400', bg: 'bg-amber-950/20', border: 'border-amber-500/30', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]' },
  '2nd': { color: 'text-slate-300', bg: 'bg-slate-950/20', border: 'border-slate-400/20', glow: 'shadow-[0_0_15px_rgba(148,163,184,0.1)]' },
  '3rd': { color: 'text-amber-700', bg: 'bg-amber-950/10', border: 'border-amber-700/20', glow: 'shadow-[0_0_15px_rgba(180,83,9,0.08)]' },
};

function getPrizeStyle(place: string) {
  const norm = place.toLowerCase().trim();
  if (norm.includes('1st') || norm.includes('first') || norm.includes('1')) {
    return prizeStyles['1st'];
  }
  if (norm.includes('2nd') || norm.includes('second') || norm.includes('2')) {
    return prizeStyles['2nd'];
  }
  if (norm.includes('3rd') || norm.includes('third') || norm.includes('3')) {
    return prizeStyles['3rd'];
  }
  return { color: 'text-violet-400', bg: 'bg-violet-950/20', border: 'border-violet-500/20', glow: 'shadow-sm' };
}

export function EventDetailClient({ event }: { event: Event }) {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [mode, setMode] = useState<'solo' | 'create' | 'join'>(
    event.is_team_event ? 'create' : 'solo'
  );
  
  const [teammates, setTeammates] = useState<string[]>(
    Array(Math.max(0, event.max_team_size - 1)).fill('')
  );
  const [paymentProof, setPaymentProof] = useState({ url: '', fileId: '' });
  const [transactionId, setTransactionId] = useState('');
  const [uploadingProof, setUploadingProof] = useState(false);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [successRegNo, setSuccessRegNo] = useState('');
  
  const [profileForm, setProfileForm] = useState({
    name: '',
    college: '',
    branch: '',
    year: '',
    phone: '',
  });

  const gradient = CATEGORY_COLORS[event.category] || 'from-violet-500 to-purple-500';
  const regOpen = event.status === 'open' && new Date() >= new Date(event.reg_start_at) && new Date() <= new Date(event.reg_end_at);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('register') === 'true') {
        setTimeout(() => {
          const el = document.getElementById('registration-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add a temporary glow-highlight style class sequence
            el.classList.add('ring-2', 'ring-violet-500', 'ring-offset-4', 'ring-offset-slate-950', 'transition-all', 'duration-500');
            setTimeout(() => {
              el.classList.remove('ring-2', 'ring-violet-500', 'ring-offset-4', 'ring-offset-slate-950');
            }, 3000);
          }
        }, 300);
      }
    }
  }, [event]);

  async function handleUploadProof(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!transactionId.trim()) {
      toast.error('Please enter your UTR No / Transaction ID first.');
      e.target.value = '';
      return;
    }

    setUploadingProof(true);
    try {
      const token = await getToken();
      
      // Get upload signature
      const authRes = await apiFetch<{ signature: string; token: string; expire: number }>('/imagekit/auth', { token: token || undefined });
      if (!authRes.success || !authRes.data) throw new Error('Failed to authenticate upload');

      // Upload directly to ImageKit
      const fd = new FormData();
      fd.append('file', file);
      fd.append('fileName', `${Date.now()}_proof_${file.name}`);
      fd.append('publicKey', process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || 'public_BgmWMlkjamFDPAPN8s3LS/T3Omw=');
      fd.append('signature', authRes.data.signature);
      fd.append('expire', String(authRes.data.expire));
      fd.append('token', authRes.data.token);
      fd.append('folder', '/payment-proofs');

      const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) throw new Error('Image upload failed');
      const data = await res.json();
      setPaymentProof({ url: data.url, fileId: data.fileId });
      toast.success('Payment proof uploaded successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setUploadingProof(false);
    }
  }

  async function handleRegisterClick() {
    // Check if event is open
    const now = new Date();
    const regOpen = now >= new Date(event.reg_start_at) && now <= new Date(event.reg_end_at);
    if (!regOpen) {
      toast.error('Registration is closed');
      return;
    }

    if (!isSignedIn) {
      toast.error('Please sign in to register');
      return;
    }

    const requiresPayment = !!event.payment_qr_url || !!event.bank_name;
    if (requiresPayment) {
      if (!transactionId.trim()) {
        toast.error('Please enter your UTR No / Transaction ID.');
        return;
      }
      if (!paymentProof.url) {
        toast.error('Please upload your payment proof screenshot first.');
        return;
      }
    }

    if (event.is_team_event) {
      if (!teamName.trim()) {
        toast.error('Team Name is required');
        return;
      }
      const activeTeammates = teammates.filter(Boolean);
      const totalSize = activeTeammates.length + 1;
      if (totalSize > event.max_team_size) {
        toast.error(`Your team can have at most ${event.max_team_size} members (including you).`);
        return;
      }
    }

    setLoading(true);
    try {
      const token = await getToken();
      // Fetch user profile first to pre-populate form
      const res = await apiFetch<UserProfile>('/auth/me', { token: token || undefined });
      if (res.success && res.data) {
        setProfileForm({
          name: res.data.name || '',
          college: res.data.college || '',
          branch: res.data.branch || '',
          year: res.data.year ? String(res.data.year) : '',
          phone: res.data.phone || '',
        });
        setIsNewProfile(false);
      } else {
        setProfileForm({
          name: user?.fullName || '',
          college: '',
          branch: '',
          year: '',
          phone: '',
        });
        setIsNewProfile(true);
      }
      setShowProfileModal(true);
    } catch (e) {
      // Assuming no profile onboarding exists yet
      setProfileForm({
        name: user?.fullName || '',
        college: '',
        branch: '',
        year: '',
        phone: '',
      });
      setIsNewProfile(true);
      setShowProfileModal(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleProfileConfirmAndRegister() {
    if (!profileForm.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!profileForm.college.trim()) {
      toast.error('College is required');
      return;
    }

    const requiresPayment = !!event.payment_qr_url || !!event.bank_name;
    if (requiresPayment) {
      if (!transactionId.trim()) {
        toast.error('Please enter your UTR No / Transaction ID.');
        return;
      }
      if (!paymentProof.url) {
        toast.error('Please upload your payment proof screenshot first.');
        return;
      }
    }

    if (event.is_team_event) {
      if (!teamName.trim()) {
        toast.error('Team Name is required');
        return;
      }
      const activeTeammates = teammates.filter(Boolean);
      const totalSize = activeTeammates.length + 1;
      if (totalSize > event.max_team_size) {
        toast.error(`Your team can have at most ${event.max_team_size} members (including you).`);
        return;
      }
    }

    setLoading(true);
    try {
      const token = await getToken();
      
      // 1. Create or Update Profile
      const endpoint = isNewProfile ? '/auth/register' : '/auth/me';
      const method = isNewProfile ? 'POST' : 'PATCH';
      
      const profileData: Record<string, any> = {
        name: profileForm.name,
        college: profileForm.college,
        branch: profileForm.branch || null,
        year: profileForm.year ? Number(profileForm.year) : null,
        phone: profileForm.phone || null,
      };

      if (isNewProfile) {
        profileData.email = user?.primaryEmailAddress?.emailAddress || '';
      }
      
      const profileRes = await apiFetch(endpoint, {
        method,
        token: token || undefined,
        body: JSON.stringify(profileData),
      });

      if (!profileRes.success) {
        throw new Error(profileRes.error?.message || 'Failed to save profile details');
      }

      // 2. Submit Event Registration
      const body: Record<string, any> = {
        event_id: event.id,
        payment_proof_url: paymentProof.url || null,
        payment_proof_file_id: paymentProof.fileId || null,
        transaction_id: transactionId.trim() || null,
      };
      if (event.is_team_event) {
        body.team_name = teamName;
        body.team_members = teammates.filter(Boolean);
      }
      const res = await apiFetch('/registrations', {
        method: 'POST',
        token: token || undefined,
        body: JSON.stringify(body),
      });
      if (!res.success) throw new Error(res.error?.message);
      
      const regNo = (res.data as any)?.registration_no || '';
      setSuccessRegNo(regNo);
      setRegisteredSuccess(true);
      setShowProfileModal(false);
      toast.success(event.is_team_event ? `Registered! Team Code: ${regNo}` : 'Registered successfully!');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = 'w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-300';

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 relative">
      {/* Background Glow */}
      <div className="absolute top-[20%] left-[-10%] h-[300px] w-[300px] rounded-full bg-violet-600/5 blur-[120px] -z-10" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
        
        {/* Banner Section */}
        <div className="relative h-64 sm:h-96 rounded-3xl overflow-hidden mb-8 shadow-2xl border border-violet-500/10">
          {event.banner_url ? (
            <Image src={event.banner_url} alt={event.title} fill className="object-cover" priority sizes="100vw" />
          ) : event.poster_url ? (
            <Image src={event.poster_url} alt={event.title} fill className="object-cover" priority sizes="100vw" />
          ) : (
            <div className={cn('h-full w-full bg-gradient-to-br', gradient)} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <span className={cn('inline-block rounded-full bg-gradient-to-r px-4.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white mb-4 shadow-md', gradient)}>
              {CATEGORY_LABELS[event.category]}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight">{event.title}</h1>
          </div>
        </div>

        {/* Content & Form Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Main Info Columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap gap-3.5">
              <span className={cn('rounded-xl border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md', STATUS_COLORS[event.status])}>
                {event.status}
              </span>
              <span className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-400">
                <Calendar className="h-4 w-4 text-violet-400" />
                {formatDate(event.event_start_at)}
              </span>
              {event.venue && (
                <span className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-400">
                  <MapPin className="h-4 w-4 text-cyan-400" />
                  {event.venue}
                </span>
              )}
              {event.is_team_event && (
                <span className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-400">
                  <Users className="h-4 w-4 text-pink-400" />
                  Max Team Size: {event.max_team_size}
                </span>
              )}
              {event.whatsapp_link && (
                <a
                  href={event.whatsapp_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-900/30 hover:border-emerald-500/50 transition-all shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:scale-[1.02] cursor-pointer"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.488 1.449 5.412 1.451 5.465 0 9.91-4.444 9.914-9.913.002-2.65-1.02-5.14-2.88-7.003C17.228 1.826 14.74 1.802 12.014 1.802c-5.47 0-9.915 4.445-9.919 9.915-.002 1.957.51 3.868 1.482 5.568L2.53 21.68l4.117-1.08zM17.47 15.114c-.29-.145-1.72-.848-1.987-.946-.266-.097-.46-.145-.653.145-.193.29-.75.946-.918 1.14-.168.193-.335.217-.626.072-2.812-1.406-4.63-2.985-5.63-4.71-.267-.457-.027-.704.2-.93.202-.202.447-.52.67-.78.223-.26.297-.444.447-.74.15-.3.075-.558-.037-.78-.112-.223-.946-2.28-1.296-3.123-.34-.82-.713-.708-.98-.72l-.834-.012c-.29 0-.76.11-1.157.545-.397.436-1.517 1.484-1.517 3.618 0 2.134 1.55 4.2 1.768 4.49.217.29 3.05 4.66 7.39 6.54 1.033.447 1.84.714 2.47.915 1.04.33 1.987.284 2.733.173.83-.124 1.72-.703 1.96-1.35.24-.648.24-1.205.168-1.32-.072-.116-.266-.192-.557-.337z"/>
                  </svg>
                  Join WhatsApp Group
                </a>
              )}
            </div>

            {/* About Box */}
            <section className="glass rounded-2xl p-6 sm:p-8 border border-violet-500/10">
              <h2 className="text-xl font-bold mb-4 font-heading text-violet-400 flex items-center gap-2">
                <Info className="h-5 w-5 text-violet-400" /> About the Event
              </h2>
              <div className="text-slate-300 leading-relaxed font-sans rich-text" dangerouslySetInnerHTML={{ __html: event.description }} />
            </section>

            {/* Rules Box */}
            {event.rules && (
              <section className="glass rounded-2xl p-6 sm:p-8 border border-violet-500/10">
                <h2 className="text-xl font-bold mb-4 font-heading text-cyan-400 flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-cyan-400" /> Rules & Guidelines
                </h2>
                <div className="text-slate-300 leading-relaxed text-sm font-sans rich-text" dangerouslySetInnerHTML={{ __html: event.rules }} />
              </section>
            )}

            {/* Prizes Box */}
            {event.prizes && Object.keys(event.prizes).length > 0 && (
              <section className="glass rounded-2xl p-6 sm:p-8 border border-violet-500/10">
                <h2 className="text-xl font-bold mb-5 font-heading flex items-center gap-2 text-amber-400">
                  <Trophy className="h-5 w-5 text-amber-400 animate-pulse" /> Prizes & Rewards
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {Object.entries(event.prizes).map(([place, amt]) => {
                    const style = getPrizeStyle(place);
                    return (
                      <div 
                        key={place} 
                        className={cn(
                          "rounded-xl px-5 py-4 border flex items-center gap-4 transition-all duration-300 hover:scale-[1.02]",
                          style.bg, style.border, style.glow
                        )}
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-900 border border-slate-800">
                          <Trophy className={cn("h-5 w-5", style.color)} />
                        </div>
                        <div>
                          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">{place}</span>
                          <p className="font-extrabold text-white text-lg font-heading mt-0.5">{amt}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Payment Details */}
            {(event.payment_qr_url || event.bank_name) && (
              <section className="glass rounded-2xl p-6 sm:p-8 border border-violet-500/20 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 bg-violet-600/5 blur-2xl -z-10" />
                <h2 className="text-xl font-bold mb-3 text-violet-400 font-heading flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-violet-400" /> Payment details
                </h2>
                
                {/* Entry fee amount summary */}
                {event.amount && event.amount > 0 && (
                  <div className="mb-6 p-4.5 bg-violet-950/30 border border-violet-500/25 rounded-2xl flex justify-between items-center shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                    <div>
                      <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Total Entry Fee</span>
                      <span className="text-slate-300 text-xs mt-0.5 block">Transfer this exact amount to qualify</span>
                    </div>
                    <span className="text-2xl font-black text-violet-300 font-heading">₹{event.amount}</span>
                  </div>
                )}

                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  Please complete your payment transfer via UPI QR scan or Bank Transfer, and upload your transaction receipt screenshot below.
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                  {event.payment_qr_url && (
                    <div className="flex flex-col items-center p-5 rounded-2xl bg-slate-950/40 border border-slate-900 shadow-inner">
                      <span className="text-xs text-slate-400 mb-4 font-bold uppercase tracking-wider">Scan QR Code</span>
                      <div className="relative w-48 h-48 bg-white p-3 rounded-2xl shadow-xl">
                        <Image src={event.payment_qr_url} alt="Payment QR" fill className="object-contain p-2" sizes="192px" />
                      </div>
                    </div>
                  )}
                  {event.bank_name && (
                    <div className="flex flex-col justify-center p-5 rounded-2xl bg-slate-950/40 border border-slate-900 space-y-3.5 text-sm">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider border-b border-slate-900 pb-2 mb-1 block">Bank Transfer Credentials</span>
                      <div className="flex justify-between"><span className="text-slate-500 font-medium">Bank Name:</span> <span className="text-slate-200 font-bold">{event.bank_name}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500 font-medium">Account No:</span> <span className="text-slate-200 font-mono font-bold">{event.bank_account_no}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500 font-medium">IFSC Code:</span> <span className="text-slate-200 font-mono font-bold text-violet-300">{event.bank_ifsc}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500 font-medium">Beneficiary:</span> <span className="text-slate-200 font-semibold">{event.bank_recipient_name}</span></div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar / Registration Form */}
          <div className="space-y-4">
            {event.banner_url && event.poster_url && (
              <div className="glass rounded-2xl overflow-hidden p-2.5 border border-violet-500/10 hidden lg:block">
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-950">
                  <Image src={event.poster_url} alt={event.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
                </div>
              </div>
            )}
            
            <div id="registration-section" className="glass rounded-2xl p-6 sticky top-24 border border-violet-500/15 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 h-24 w-24 bg-cyan-500/5 blur-2xl -z-10" />
              
              <h3 className="font-extrabold text-xl mb-4 font-heading tracking-tight text-white flex items-center gap-2">
                <Ticket className="h-5 w-5 text-violet-400" /> Registration Setup
              </h3>
              
              {/* Entry Fee displayed inside registration box */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-900">
                <span className="text-slate-400 text-sm">Entry Fee</span>
                <span className="text-lg font-black text-white font-heading">
                  {event.amount && event.amount > 0 ? `₹${event.amount}` : 'Free Entry'}
                </span>
              </div>

              {regOpen ? (
                <>
                  {event.is_team_event && (
                    <div className="space-y-3.5 mb-5">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 px-1 font-bold uppercase tracking-wider">
                        <span>Team Requirements</span>
                        <span className="font-semibold text-violet-400">Max {event.max_team_size} members (Inc. Leader)</span>
                      </div>
                      <input 
                        value={teamName} 
                        onChange={(e) => setTeamName(e.target.value)} 
                        placeholder="Assign Team Name" 
                        className={inputClass} 
                      />
                      {teammates.map((member, idx) => (
                        <input
                           key={idx}
                           value={member}
                           onChange={(e) => {
                             const copy = [...teammates];
                             copy[idx] = e.target.value;
                             setTeammates(copy);
                           }}
                           placeholder={`Teammate ${idx + 2} Full Name`}
                           className={inputClass}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Payment Screenshot Upload */}
                  {(event.payment_qr_url || event.bank_name) && (
                    <>
                      {/* UTR / Transaction ID Input */}
                      <div className="mb-5 space-y-2.5">
                        <label className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                          UTR No / Transaction ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="Enter UTR or Transaction ID"
                          className={inputClass}
                          disabled={uploadingProof || !!paymentProof.url}
                        />
                        {!transactionId.trim() && (
                          <p className="text-[10px] text-amber-500/90 font-medium">
                            ⚠ Must be filled before uploading payment proof.
                          </p>
                        )}
                      </div>

                      <div className="mb-5 space-y-2.5">
                        <label className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                          Upload Transfer Receipt Screenshot <span className="text-red-500">*</span>
                        </label>
                        {paymentProof.url ? (
                          <div className="flex items-center gap-3.5 p-2 bg-slate-900 border border-slate-800 rounded-xl">
                            <img src={paymentProof.url} alt="Proof" className="h-10 w-10 object-cover rounded-lg border border-slate-800" />
                            <span className="text-xs text-slate-300 flex-1 truncate font-mono">receipt_proof.jpg</span>
                            <button
                              type="button"
                              onClick={() => setPaymentProof({ url: '', fileId: '' })}
                              className="text-xs text-red-400 hover:text-red-300 font-bold px-3 py-1.5 rounded-lg hover:bg-slate-950 transition-all"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <label
                            className={cn(
                              "flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl p-5 bg-slate-950/20 transition-all duration-300",
                              !transactionId.trim()
                                ? "opacity-50 cursor-not-allowed border-amber-500/20"
                                : "hover:border-violet-500/50 hover:bg-slate-950/60 cursor-pointer"
                            )}
                            onClick={(e) => {
                              if (!transactionId.trim()) {
                                e.preventDefault();
                                toast.error('Please enter your UTR No / Transaction ID first.');
                              }
                            }}
                          >
                            {uploadingProof ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
                                <span className="text-xs text-slate-400">Uploading...</span>
                              </div>
                            ) : (
                              <div className="text-center">
                                <span className="text-xs text-slate-300 font-semibold block">Click to upload screenshot</span>
                                <span className="text-[10px] text-slate-500 block mt-1">JPEG, PNG up to 10MB</span>
                              </div>
                            )}
                            <input
                              type="file"
                              onChange={handleUploadProof}
                              disabled={uploadingProof || !transactionId.trim()}
                              className="hidden"
                              accept="image/*"
                            />
                          </label>
                        )}
                      </div>
                    </>
                  )}

                  <button 
                    onClick={handleRegisterClick} 
                    disabled={loading} 
                    className="w-full rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 py-3.5 font-bold text-white hover:opacity-95 shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer premium-btn"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm & Register'}
                  </button>
                  <p className="text-[10px] text-slate-500 mt-3 text-center uppercase tracking-wider font-semibold">
                    Registration Closes {formatDate(event.reg_end_at)}
                  </p>
                </>
              ) : (
                <div className="rounded-xl bg-slate-950/40 border border-slate-900 p-4 text-center">
                  <p className="text-slate-400 text-sm font-semibold">Registration is currently closed.</p>
                </div>
              )}
              <Link href="/dashboard" className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors uppercase tracking-wider">
                <Download className="h-4 w-4" /> View my registrations
              </Link>
            </div>

          </div>
        </div>
      </motion.div>

      {/* Profile Onboarding Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="glass rounded-3xl p-6 sm:p-8 w-full max-w-md space-y-5 relative border border-violet-500/20"
            >
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-900 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div>
                <h3 className="text-2xl font-black text-white font-heading">Confirm Profile Details</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Complete your student profile registration for <span className="text-violet-400 font-semibold">{event.title}</span>.
                </p>
              </div>
              
              <div className="space-y-4 pt-1">
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    placeholder="Your Full Name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1.5">College</label>
                  <input
                    type="text"
                    value={profileForm.college}
                    onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                    placeholder="College Name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1.5">Branch</label>
                  <input
                    type="text"
                    value={profileForm.branch}
                    onChange={(e) => setProfileForm({ ...profileForm, branch: e.target.value })}
                    placeholder="e.g. Computer Science"
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1.5">Year</label>
                    <select
                      value={profileForm.year}
                      onChange={(e) => setProfileForm({ ...profileForm, year: e.target.value })}
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    >
                      <option value="">Select year</option>
                      {[1, 2, 3, 4, 5, 6].map((y) => (
                        <option key={y} value={y}>Year {y}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1.5">Phone</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="Phone Number"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleProfileConfirmAndRegister}
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 py-3.5 font-bold text-white hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg premium-btn"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm & Submit Registration'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Registration Success Overlay */}
      <AnimatePresence>
        {registeredSuccess && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="glass rounded-3xl p-8 w-full max-w-md text-center space-y-6 border border-emerald-500/25 shadow-[0_0_40px_rgba(16,185,129,0.15)] relative"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 animate-bounce" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white font-heading">Successfully Registered!</h3>
                <p className="text-sm text-slate-400">
                  Your registration request for <span className="text-violet-400 font-semibold">{event.title}</span> has been submitted.
                </p>
              </div>

              {successRegNo && (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl inline-block w-full">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Registration Code</span>
                  <span className="text-xl font-mono font-black text-violet-300 mt-1 block tracking-wider select-all">{successRegNo}</span>
                  {event.is_team_event && (
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Share this code with teammates to join your team</span>
                  )}
                </div>
              )}

              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900 text-xs text-slate-500 text-left flex gap-2.5 items-start">
                <Sparkle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  If a payment receipt was submitted, your registration status will remain pending until verified by our events coordinator team. You can check the status on your dashboard.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                {event.whatsapp_link && (
                  <a
                    href={event.whatsapp_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-500 transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Join WhatsApp Group
                  </a>
                )}
                <Link 
                  href="/dashboard" 
                  onClick={() => setRegisteredSuccess(false)}
                  className="w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white hover:bg-violet-500 transition-colors shadow-lg cursor-pointer"
                >
                  Go to My Registrations
                </Link>
                <button 
                  onClick={() => setRegisteredSuccess(false)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-3 text-sm font-bold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
