/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { fetcher } from '@/lib/fetcher';
import { useMemo, useRef, useState } from 'react';

const WEBSITE_HOST = process.env.NEXT_PUBLIC_WEBSITE_HOST ?? '';

export default function SlugField({ form }: { form: any }) {
  const [status, setStatus] = useState<null | 'checking' | 'ok' | 'taken'>(
    null,
  );
  const [normalized, setNormalized] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // debounce helper
  const debounce = (fn: (...args: any[]) => void, ms = 400) => {
    let t: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  };

  const checkSlug = async (value: string) => {
    if (!value) {
      setStatus(null);
      setNormalized(null);
      abortRef.current?.abort();
      // kosongin error kalau field dikosongin (optional)
      form.clearErrors('slug');
      return;
    }

    setStatus('checking');

    // cancel request sebelumnya
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const url = `/api/dashboard/websites/check-slug/${encodeURIComponent(
        value,
      )}`;

      const data = await fetcher<{
        available: boolean;
        slug: string;
        error?: string;
      }>(url, {
        method: 'GET',
        signal: controller.signal,
      });

      const serverSlug = data.slug ?? value;
      setNormalized(serverSlug);

      if (data.available) {
        // available → bersihin error
        form.clearErrors('slug');
        setStatus('ok');
      } else {
        form.setError('slug', {
          type: 'manual',
          message: data.error ?? 'Slug is not available',
        });
        setStatus('taken');
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      // Jika server kirimkan pesan error terstruktur, tampilkan
      const msg =
        (err?.data && typeof err.data === 'object' && 'error' in err.data
          ? (err.data as any).error
          : null) || 'Gagal cek ketersediaan. Coba lagi.';

      if (err?.data && typeof err.data === 'object' && 'slug' in err.data) {
        setNormalized((err.data as any).slug ?? null);
      }

      form.setError('slug', { type: 'manual', message: msg });
      setStatus('taken');
    }
  };

  // penting: depend on `form` biar closure update saat instance form berubah
  const debouncedCheck = useMemo(() => debounce(checkSlug, 400), [checkSlug]);

  return (
    <FormField
      control={form.control}
      name="slug"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Subdomain</FormLabel>
          <FormControl>
            <div className="flex items-center gap-2">
              <Input
                placeholder="your-subdomain"
                {...field}
                onChange={(e) => {
                  field.onChange(e); // keep RHF in sync
                  debouncedCheck(e.target.value); // cek async
                }}
                onBlur={(e) => {
                  debouncedCheck(e.target.value); // cek juga saat blur
                }}
              />
              <p>{WEBSITE_HOST}</p>
            </div>
          </FormControl>

          {/* feedback kecil */}
          {status === 'checking' && (
            <p className="mt-1 text-sm text-gray-500">Checking…</p>
          )}
          {status === 'ok' && (
            <p className="mt-1 text-sm text-green-600">
              Available{normalized ? ` (normalized: ${normalized})` : ''}
            </p>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
