/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from 'react';

export default function FaviconWebsiteOnlyJson() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resultJson, setResultJson] = useState<any | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pickFile = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResultJson(null);
    }
  };

  const resizeImage = (img: HTMLImageElement, size: number): Promise<Blob> =>
    new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      const ratio = Math.min(size / img.width, size / img.height);
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const x = Math.round((size - w) / 2);
      const y = Math.round((size - h) / 2);
      ctx.clearRect(0, 0, size, size);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, x, y, w, h);
      canvas.toBlob((blob) => resolve(blob!), 'image/png');
    });

  async function uploadBlob(name: string, blob: Blob, url = '/api/upload') {
    const f = new File([blob], name, { type: 'image/png' });
    const fd = new FormData();
    fd.append('file', f);
    const res = await fetch(url, { method: 'POST', body: fd });
    if (!res.ok) throw new Error(await res.text().catch(() => 'Upload failed'));
    return res.json(); // expect { url: '...', name: '...' }
  }

  const generate = async () => {
    if (!file || !preview) return;
    setUploading(true);
    setResultJson(null);
    try {
      const img = new Image();
      img.src = preview;
      await img.decode();

      const sizes = [16, 32, 48];
      const outputs: Record<string, string> = {};

      for (const s of sizes) {
        const blob = await resizeImage(img, s);
        const resp = await uploadBlob(`favicon-${s}.png`, blob);
        if (resp.url) outputs[s] = resp.url;
      }

      setResultJson(outputs);
    } catch (e: any) {
      console.error(e);
      alert(e?.message || 'Generation/upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">
        Favicon Generator (JSON output)
      </h1>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      <button
        onClick={pickFile}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Choose Image
      </button>

      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="preview"
            className="h-32 w-32 border object-contain"
          />
          <button
            onClick={generate}
            disabled={uploading}
            className="mt-4 rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {uploading ? 'Generating & Uploading…' : 'Generate Favicons'}
          </button>

          {resultJson && (
            <div className="mt-6">
              <div className="mb-1 font-medium">JSON result:</div>
              <textarea
                readOnly
                value={JSON.stringify(resultJson, null, 2)}
                className="h-40 w-full rounded border p-2 font-mono text-xs"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
