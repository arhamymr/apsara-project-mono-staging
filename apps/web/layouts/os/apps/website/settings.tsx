'use client';

import { Button } from '@workspace/ui/components/button';
import { useWebsite } from '@/hooks/use-website';
import { fetcher } from '@/lib/fetcher';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { AdsManager } from './components/meta-data/campaign';

export function Settings() {
  const { form } = useWebsite();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const slug =
      form.getValues('currentSlug') || form.getValues('slug') || undefined;

    if (!slug) {
      toast.error('Please save your website before deleting it.');
      return;
    }

    const confirmed = window.confirm(
      `Delete website “${slug}”? This action cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await fetcher(`/api/dashboard/websites/${encodeURIComponent(slug)}`, {
        method: 'DELETE',
      });
      await queryClient.invalidateQueries({ queryKey: ['dashboard-websites'] });
      toast.success('Website deleted successfully.');
      router.push('/dashboard/website');
    } catch (error: any) {
      const message =
        (error?.data &&
        typeof error.data === 'object' &&
        'message' in error.data
          ? (error.data as any).message
          : null) ||
        error?.message ||
        'Failed to delete website.';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl rounded-tl-none rounded-tr-none border p-4">
      <div className="flex gap-4">
        <AdsManager />
      </div>

      <div className="border-destructive/30 bg-destructive/5 rounded-lg border p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-destructive text-sm font-semibold">
              Danger Zone
            </p>
            <p className="text-muted-foreground text-sm">
              Permanently delete this website and all associated content.
            </p>
          </div>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Website
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
