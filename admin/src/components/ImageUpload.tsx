'use client';

import { useState } from 'react';
import { adminFetch } from '@/lib/api';
import { Upload, X, Loader2, Link2, FileImage } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  label: string;
  valueUrl: string;
  valueFileId: string;
  onChange: (url: string, fileId: string) => void;
  folder?: string;
}

export function ImageUpload({ label, valueUrl, valueFileId, onChange, folder }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Fetch auth credentials from backend
      const authRes = await adminFetch<{ token: string; signature: string; expire: number }>('/imagekit/admin/auth');
      
      if (authRes.success && authRes.data) {
        const { token, signature, expire } = authRes.data;

        // 2. Upload file to ImageKit
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        formData.append('publicKey', process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || 'public_BgmWMlkjamFDPAPN8s3LS/T3Omw=');
        formData.append('signature', signature);
        formData.append('expire', String(expire));
        formData.append('token', token);
        if (folder) {
          formData.append('folder', folder);
        }

        const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const result = await res.json();
          onChange(result.url, result.fileId);
          toast.success(`${label} uploaded!`);
          return;
        }
      }

      // Fallback: Read file as Data URL if ImageKit is unconfigured or fails
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          onChange(dataUrl, '');
          toast.success(`${label} uploaded!`);
        }
      };
      reader.readAsDataURL(file);

    } catch (err: any) {
      // Fallback on error to Data URL
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          if (dataUrl) {
            onChange(dataUrl, '');
            toast.success(`${label} loaded!`);
          }
        };
        reader.readAsDataURL(file);
      } catch (_) {
        toast.error(err.message || 'Upload failed');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleApplyManualUrl = () => {
    if (!manualUrl.trim()) return;
    onChange(manualUrl.trim(), '');
    setShowUrlInput(false);
    setManualUrl('');
    toast.success('Image URL applied');
  };

  const handleRemove = async () => {
    if (confirm('Remove image?')) {
      if (valueFileId) {
        try {
          await adminFetch(`/imagekit/file/${valueFileId}`, { method: 'DELETE' });
        } catch (e) {
          console.error('Failed to delete from ImageKit:', e);
        }
      }
      onChange('', '');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-slate-300 block">{label}</label>
        {!valueUrl && (
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 font-medium transition-colors"
          >
            {showUrlInput ? <FileImage className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
            {showUrlInput ? 'Upload File' : 'Paste Image URL'}
          </button>
        )}
      </div>

      {valueUrl ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900/50 p-2 flex items-center gap-4">
          <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-800">
            <img src={valueUrl} alt={label} className="object-cover h-full w-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400 truncate select-all">{valueUrl}</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-2 bg-red-950/40 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-950/60 mr-2 flex-shrink-0 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="Paste direct Image URL (https://...)"
            className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          />
          <button
            type="button"
            onClick={handleApplyManualUrl}
            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl transition-all shrink-0"
          >
            Apply
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl p-6 hover:border-violet-500/50 cursor-pointer bg-slate-900/20 hover:bg-slate-900/40 transition">
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
              <span className="text-xs text-slate-400">Processing file...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-6 w-6 text-slate-400" />
              <span className="text-xs text-slate-300 font-medium">Click to upload file</span>
              <span className="text-[10px] text-slate-500">PNG, JPG, WebP images</span>
            </div>
          )}
          <input type="file" onChange={handleUpload} disabled={uploading} className="hidden" accept="image/*" />
        </label>
      )}
    </div>
  );
}
