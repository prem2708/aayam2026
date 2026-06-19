'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { adminFetch } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function ScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{
    duplicate?: boolean;
    error?: boolean;
    message?: string;
    events?: { title?: string };
    users?: { name?: string; college?: string };
    registration_no?: string;
  } | null>(null);
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
      const res = await adminFetch<typeof result>('/registrations/scan', {
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
            const res = await adminFetch<typeof result>('/registrations/scan', {
              method: 'POST',
              body: JSON.stringify({ qr_token: decodedText }),
            });
            if (!res.success) throw new Error(res.error?.message);
            setResult(res.data as typeof result);
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
            <div className="flex items-center gap-3 mb-3">
              {result.error ? (
                <AlertTriangle className="h-8 w-8 text-red-500" />
              ) : result.duplicate ? (
                <AlertTriangle className="h-8 w-8 text-amber-400" />
              ) : (
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              )}
              <div>
                <p className="font-semibold text-white">
                  {result.error 
                    ? 'Invalid Registration ID' 
                    : result.duplicate 
                      ? 'Duplicate Data (Already Checked In)' 
                      : 'Check-in Successful'}
                </p>
                {result.events?.title && <p className="text-sm text-slate-400">{result.events.title}</p>}
                {result.error && <p className="text-sm text-red-400 mt-0.5">{result.message}</p>}
              </div>
            </div>
            {!result.error && (
              <>
                <p className="text-lg font-medium text-slate-100">{result.users?.name}</p>
                <p className="text-sm text-slate-400">{result.users?.college}</p>
                {result.registration_no && (
                  <p className="text-xs text-violet-400 mt-2 font-medium">Registration ID: {result.registration_no}</p>
                )}
              </>
            )}
            <button onClick={() => { setResult(null); startScanner(); }} className="mt-4 w-full rounded-lg bg-slate-800 py-2 text-sm hover:bg-slate-700 text-slate-200">
              Scan Next
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
