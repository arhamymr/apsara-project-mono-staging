/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWebsite } from '@/hooks/use-website';
import { useWebsiteStrings } from '@/i18n/website';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import {
  AppWindow,
  ArrowRightIcon,
  DraftingCompass,
  Earth,
  Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { BlogsPanel } from './blogs';
import { BuilderProperties } from './build/properties';
import { BuilderSidebar } from './build/right-sidebar';
import { Toolbar } from './build/toolbar';
import { Preview } from './elements/preview';
import { Metadata } from './metadata';
import { Settings } from './settings';
import { ThemePanel } from './theme';

export function ComponentBuilder() {
  const { activePage, tabState, setTabState, form, handleSubmit } =
    useWebsite();
  const s = useWebsiteStrings();
  const [submissionState, setSubmissionState] = useState<
    'idle' | 'draft' | 'publish'
  >('idle');
  const queryClient = useQueryClient();

  const submitWebsite = (status: 'draft' | 'activated') => {
    if (submissionState !== 'idle') return;

    const routeKey = (() => {
      const current = form.getValues('currentSlug');
      return current
        ? `dashboard/website/edit/${current}`
        : 'dashboard/website/create';
    })();

    form.handleSubmit(
      async (values) => {
        setSubmissionState(status === 'draft' ? 'draft' : 'publish');
        try {
          const result = await handleSubmit({ ...values, status }, routeKey);
          const responseSlug =
            result?.website?.slug ??
            (typeof result?.slug === 'string' ? result.slug : undefined);

          if (responseSlug) {
            form.setValue('currentSlug', responseSlug);
            form.setValue('slug', responseSlug);
          }

          await queryClient.invalidateQueries({
            queryKey: ['dashboard-websites'],
          });

          toast.success(
            status === 'draft'
              ? 'Website saved as draft.'
              : 'Website published successfully.',
          );
        } catch (error: any) {
          const fieldErrors =
            error?.data &&
            typeof error.data === 'object' &&
            'errors' in error.data
              ? (error.data as any).errors
              : null;

          const slugMsg: string | undefined = fieldErrors?.slug?.[0];
          if (slugMsg) {
            form.setError('slug', { type: 'server', message: slugMsg });
            setTabState('general');
          } else if (
            error?.data &&
            typeof error.data === 'object' &&
            'error' in error.data
          ) {
            const msg = (error.data as any).error;
            if (typeof msg === 'string' && msg) {
              form.setError('slug', { type: 'server', message: msg });
              setTabState('general');
            }
          }

          toast.error(error?.message ?? 'Failed to save website.');
        } finally {
          setSubmissionState('idle');
        }
      },
      (errors) => {
        const firstError = Object.values(errors ?? {})[0];
        if (firstError && typeof firstError?.message === 'string') {
          toast.error(firstError.message);
        } else {
          toast.error('Please complete the required fields before continuing.');
        }
        setTabState('general');
      },
    )();
  };

  const handleSaveDraft = () => submitWebsite('draft');
  const handlePublish = () => submitWebsite('activated');
  const isDrafting = submissionState === 'draft';
  const isPublishing = submissionState === 'publish';

  return (
    <>
      <div className="bg-background text-foreground h-full w-full rounded-md">
        {/* <div className="p-2"> */}
        <Tabs value={tabState} onValueChange={setTabState}>
          <div
            className={cn(
              'top-0',
              'bg-background text-foreground sticky z-10 flex items-center justify-between rounded-lg rounded-br-none rounded-bl-none border p-2',
            )}
          >
            <div className="flex gap-2">
              <TabsList>
                <TabsTrigger value="general">{s.tabs.general}</TabsTrigger>
                <TabsTrigger value="build">
                  <div className="flex items-center gap-2">
                    <AppWindow className="mt-[1px] h-4 w-4" />
                    <p className="text-sm">{s.tabs.build}</p>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="blogs">{s.tabs.blogs}</TabsTrigger>
                <TabsTrigger value="theme">{s.tabs.theme}</TabsTrigger>
                <TabsTrigger value="settings">{s.tabs.settings}</TabsTrigger>
              </TabsList>
              <Toolbar />
            </div>
            <div>
              {' '}
              {tabState === 'general' && (
                <Button
                  type="button"
                  variant={'outline'}
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setTabState('build');
                  }}
                >
                  {s.actions.buildPage}
                  <ArrowRightIcon className="mt-[1px] h-4 w-4" />
                </Button>
              )}
              {tabState !== 'general' && (
                <div className="flex gap-2">
                  <Button
                    variant={'outline'}
                    size="sm"
                    onClick={() => {
                      const slug = form.getValues('slug')?.trim();
                      if (!slug) {
                        toast.error('Add a slug before previewing.');
                        setTabState('general');
                        return;
                      }
                      window.open(
                        `/sites/${encodeURIComponent(slug)}`,
                        '_blank',
                        'noopener',
                      );
                    }}
                    disabled={isDrafting || isPublishing}
                  >
                    Preview
                  </Button>
                  <Button
                    variant={'ghost'}
                    size="sm"
                    onClick={handleSaveDraft}
                    disabled={isDrafting || isPublishing}
                  >
                    {isDrafting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <DraftingCompass className="h-4 w-4" />
                        {s.actions.saveDraft}
                      </>
                    )}
                  </Button>
                  <Button
                    variant={'outline'}
                    size="sm"
                    onClick={handlePublish}
                    disabled={isDrafting || isPublishing}
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Earth className="h-4 w-4" />
                        {s.actions.publish}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <TabsContent value="general" className="mt-0">
            <Metadata />
          </TabsContent>
          <TabsContent value="build" className="mt-0 rounded-b-lg border">
            <div className="flex">
              <BuilderSidebar />
              <Preview page={activePage} />
              <BuilderProperties />
            </div>
          </TabsContent>
          <TabsContent value="blogs" className="mt-0">
            <BlogsPanel />
          </TabsContent>
          <TabsContent value="theme" className="mt-0">
            <ThemePanel />
          </TabsContent>
          <TabsContent value="settings" className="mt-0">
            <Settings />
          </TabsContent>
        </Tabs>
        {/* </div> */}
      </div>
    </>
  );
}
