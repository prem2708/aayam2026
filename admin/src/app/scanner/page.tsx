'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, CheckCircle, AlertTriangle, Loader2, User, Phone, BookOpen, Users, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { adminFetch } from '@/lib/api';
import { cn } from '@/lib/utils';

type ScanResult = {
  duplicate?: boolean;
  error?: boolean;
  message?: string;
  events?: { title?: string; venue?: string; event_start_at?: string };
  users?: {
    name?: string;
    college?: string;
    email?: string;
    phone?: string;
    branch?: string;
    year?: number;
  };
  teams?: {
    name?: string;
    members?: string[];
  };
  registration_no?: string;
  status?: string;
} | null;

export default function ScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult>(null);
  const [manualCode, setManualCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const scannerRef = useRef<{ stop: () => Promise<void> } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  async function handleManualCheckIn() {
    if (!manualCode.trim()) {
      toast.error('Please enter a Registration ID');
      return;
    }

    setSubmitting(true);
    try {
      const res = await adminFetch<ScanResult>('/registrations/scan', {
        method: 'POST',
        body: JSON.stringify({ qr_token: manualCode.trim() }),
      });
      if (!res.success) throw new Error(res.error?.message);
      setResult(res.data || null);
      if (res.data?.duplicate) toast.warning('Duplicate Data: Already checked in');
      else toast.success('Attendance marked!');
      setManualCode('');
    } catch (e: any) {
      setResult({
        error: true,
        message: e instanceof Error ? e.message : 'Invalid Registration ID or check-in failed',
      });
      toast.error(e instanceof Error ? e.message : 'Manual check-in failed');
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    return () => {
      scannerRef.current?.stop().catch(() => {});
    };
  }, []);

  async function startScanner() {
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;
      setScanning(true);

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          await scanner.stop();
          setScanning(false);
          scannerRef.current = null;

          try {
            const res = await adminFetch<ScanResult>('/registrations/scan', {
              method: 'POST',
              body: JSON.stringify({ qr_token: decodedText }),
            });
            if (!res.success) throw new Error(res.error?.message);
            setResult(res.data as ScanResult);
            if (res.data?.duplicate) toast.warning('Duplicate Data: Already checked in');
            else toast.success('Attendance marked!');
          } catch (e: any) {
            setResult({
              error: true,
              message: e instanceof Error ? e.message : 'Invalid Registration ID or Scan failed',
            });
            toast.error(e instanceof Error ? e.message : 'Scan failed');
          }
        },
        () => {}
      );
    } catch {
      toast.error('Camera access denied or not available');
      setScanning(false);
    }
  }

  async function stopScanner() {
    await scannerRef.current?.stop().catch(() => {});
    scannerRef.current = null;
    setScanning(false);
  }

  const membersList = Array.isArray(result?.teams?.members) ? (result.teams!.members as string[]) : [];

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-2 flex items-center gap-2"><ScanLine className="h-6 w-6 text-violet-400" /> QR Scanner</h1>
      <p className="text-slate-400 text-sm mb-6">Scan student e-ticket QR codes to mark attendance</p>

      <div id="qr-reader" ref={containerRef} className="rounded-xl overflow-hidden mb-4" />

      {!scanning ? (
        <button onClick={startScanner} className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 py-3 font-semibold hover:opacity-90">
          Start Camera
        </button>
      ) : (
        <button onClick={stopScanner} className="w-full rounded-xl border border-red-500/30 text-red-400 py-3 font-semibold hover:bg-red-500/10">
          Stop Scanner
        </button>
      )}

      {!scanning && (
        <div className="mt-8 border-t border-slate-800 pt-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-2">Or Verify Manually</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Registration ID"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualCheckIn()}
              className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
            <button
              onClick={handleManualCheckIn}
              disabled={submitting}
              className="rounded-xl bg-violet-600 hover:bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : 'Check In'}
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "mt-6 glass rounded-xl p-5 border",
              result.error 
                ? "border-red-500/20 bg-red-950/10" 
                : result.duplicate 
                  ? "border-amber-500/20 bg-amber-950/10" 
                  : "border-emerald-500/20 bg-emerald-950/10"
            )}
          >
            {/* Header Status */}
            <div className="flex items-center gap-3 mb-4">
              {result.error ? (
                <AlertTriangle className="h-8 w-8 text-red-500 shrink-0" />
              ) : result.duplicate ? (
                <AlertTriangle className="h-8 w-8 text-amber-400 shrink-0" />
              ) : (
                <CheckCircle className="h-8 w-8 text-emerald-400 shrink-0" />
              )}
              <div>
                <p className="font-bold text-white text-base">
                  {result.error 
                    ? 'Invalid Registration ID' 
                    : result.duplicate 
                      ? 'Already Checked In' 
                      : 'Check-in Successful ✓'}
                </p>
                {result.error && <p className="text-sm text-red-400 mt-0.5">{result.message}</p>}
              </div>
            </div>

            {!result.error && (
              <>
                {/* Registration No */}
                {result.registration_no && (
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Reg No:</span>
                    <span className="text-sm font-bold text-violet-400 font-mono">{result.registration_no}</span>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-slate-700/60 mb-3" />

                {/* Event Info */}
                {result.events?.title && (
                  <div className="mb-3 space-y-1">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Event</p>
                        <p className="text-sm font-semibold text-cyan-300">{result.events.title}</p>
                      </div>
                    </div>
                    {result.events.venue && (
                      <div className="flex items-center gap-2 ml-6">
                        <MapPin className="h-3 w-3 text-slate-500" />
                        <p className="text-xs text-slate-400">{result.events.venue}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-slate-700/60 mb-3" />

                {/* User Info */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Participant</p>
                      <p className="text-base font-bold text-slate-100">{result.users?.name}</p>
                      <p className="text-xs text-slate-400">{result.users?.college}</p>
                      {result.users?.branch && (
                        <p className="text-xs text-slate-500">
                          {result.users.branch}{result.users.year ? ` · Year ${result.users.year}` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  {result.users?.phone && (
                    <div className="flex items-center gap-2 ml-6">
                      <Phone className="h-3 w-3 text-emerald-400" />
                      <p className="text-sm text-emerald-300 font-medium">{result.users.phone}</p>
                    </div>
                  )}
                  {result.users?.email && (
                    <div className="flex items-center gap-2 ml-6">
                      <BookOpen className="h-3 w-3 text-slate-500" />
                      <p className="text-xs text-slate-400">{result.users.email}</p>
                    </div>
                  )}
                </div>

                {/* Team / Group Info */}
                {result.teams?.name && (
                  <>
                    <div className="border-t border-slate-700/60 mb-3" />
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Team / Group</p>
                        <p className="text-sm font-bold text-amber-300">{result.teams.name}</p>
                        {membersList.length > 0 && (
                          <div className="mt-1">
                            <p className="text-xs text-slate-500 mb-1">Team Members:</p>
                            <div className="flex flex-wrap gap-1">
                              {membersList.map((m, i) => (
                                <span key={i} className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded px-1.5 py-0.5">
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            <button 
              onClick={() => { setResult(null); startScanner(); }} 
              className="mt-4 w-full rounded-lg bg-slate-800 py-2 text-sm hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Scan Next
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
