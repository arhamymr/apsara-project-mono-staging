/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Textarea } from '@workspace/ui/components/textarea';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Loader2, Send, Sparkles, X } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

export type AIPromptWidgetProps = {
  title?: string;
  placeholder?: string;
  suggestions?: string[];
  hotkey?: string; // e.g. "mod+i"
  initialOpen?: boolean;
  className?: string;
  footerExtra?: React.ReactNode; // e.g. model selector
  showStreamingBox?: boolean;
  streamingText?: string; // display streamed text
  onClose?: () => void;
};

export default function AIPromptWidget({
  title = 'Generate Content With AI',
  placeholder = 'Type a prompt…',
  suggestions = [
    'Summarize this page',
    'Generate landing copy',
    'Create SEO keywords',
  ],
  hotkey = 'mod+i',
  initialOpen = false,
  footerExtra,
  showStreamingBox,
  streamingText,
  onClose,
}: AIPromptWidgetProps) {
  const [open, setOpen] = React.useState(initialOpen);
  const [expanded, setExpanded] = React.useState(initialOpen);
  const [value, setValue] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMod = navigator.platform.includes('Mac') ? e.metaKey : e.ctrlKey;
      if (hotkey === 'mod+i' && isMod && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hotkey]);

  async function handleSend(userPrompt?: string) {
    const prompt = (userPrompt ?? value).trim();
    if (!prompt) return;

    setBusy(true);

    try {
      const res = await fetch('/api/ai/web-gen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const json = await res.json();
      console.log(json, 'json');
    } catch (error) {
      console.log(error, 'error');
      toast('Something went wrong ');
      (new Error(Object.values(error || {}).join('\n') || 'fetch failed'),
        setBusy(false));
    } finally {
      setBusy(false);
      setOpen(false);
      setExpanded(false);
      setValue('');
      onClose?.();
    }
  }

  return (
    <div className={cn('relative')}>
      <AnimatePresence>
        <motion.button
          aria-label="Open AI"
          onClick={() => {
            if (busy) return;
            setOpen(true);
            setExpanded(true);
          }}
          className="group bg-background/80 supports-[backdrop-filter]:bg-background/60 inline-flex cursor-pointer items-center gap-2 rounded-md border p-2 backdrop-blur"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin text-green-500" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
          <span className="text-xs">
            {busy ? 'Working…' : 'Generate with AI'}
          </span>
        </motion.button>
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className={cn(
              !expanded ? 'max-w-[320px]' : 'max-w-[520px]',
              'absolute top-1 w-[500px]',
            )}
          >
            <Card className="overflow-hidden rounded-lg shadow-lg">
              <CardHeader className="from-primary/5 flex flex-row items-center justify-between bg-gradient-to-r to-transparent p-3">
                <div className="flex items-center gap-2">
                  <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border">
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </span>
                  <CardTitle className="text-base">
                    {busy ? 'Working…' : title}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Close"
                    onClick={() => {
                      setOpen(false);
                      onClose?.();
                    }}
                    disabled={busy}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 p-3">
                {!!suggestions?.length && (
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                        onClick={() => handleSend(s)}
                        disabled={busy}
                      >
                        <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                        {s}
                      </Button>
                    ))}
                  </div>
                )}

                <div className="relative">
                  <Textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    rows={4}
                    className="resize-none pr-12"
                    disabled={busy}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="icon"
                    className="absolute right-2 bottom-2"
                    onClick={() => handleSend()}
                    disabled={busy || !value.trim()}
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {showStreamingBox ? (
                  <div className="rounded-md border p-3 text-sm">
                    <div className="text-muted-foreground mb-1 font-medium">
                      Response
                    </div>
                    <div className="leading-relaxed whitespace-pre-wrap">
                      {streamingText || '—'}
                    </div>
                  </div>
                ) : null}
              </CardContent>

              <CardFooter className="flex items-center justify-between gap-2 py-3">
                <div className="text-muted-foreground text-xs">
                  Press{' '}
                  <kbd className="rounded border px-1.5 py-0.5 text-[10px]">
                    Ctrl/Cmd
                  </kbd>{' '}
                  +{' '}
                  <kbd className="rounded border px-1.5 py-0.5 text-[10px]">
                    Enter
                  </kbd>{' '}
                  to send
                </div>
                <div className="flex items-center gap-2">{footerExtra}</div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
