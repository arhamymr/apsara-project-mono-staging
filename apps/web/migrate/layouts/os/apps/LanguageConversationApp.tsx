'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useWindowContext } from '@/layouts/os/WindowContext';
import { Mic, MicOff, Send, StopCircle } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type Lang = 'en' | 'ja';

type Msg = {
  id: string;
  kind: 'text' | 'audio';
  text?: string;
  audioUrl?: string;
  ts: number;
};

type RecorderState = {
  status: 'idle' | 'recording' | 'stopping' | 'error';
  error?: string;
  elapsedSec: number;
};

function useRecorder() {
  const [state, setState] = useState<RecorderState>({
    status: 'idle',
    elapsedSec: 0,
  });
  const mediaRef = useRef<MediaStream | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const tickRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (tickRef.current) cancelAnimationFrame(tickRef.current);
      try {
        recRef.current?.stop?.();
      } catch {}
      mediaRef.current?.getTracks?.().forEach((t) => t.stop());
    },
    [],
  );

  const start = async () => {
    if (state.status === 'recording') return;
    try {
      if (
        typeof window === 'undefined' ||
        typeof (window as any).MediaRecorder === 'undefined'
      ) {
        throw new Error('MediaRecorder not supported in this browser');
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRef.current = stream;
      chunksRef.current = [];
      const mimeCandidates = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
      ].filter((m) => MediaRecorder.isTypeSupported(m));
      const mimeType = mimeCandidates[0];
      const rec = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstart = () => {
        const startAt = performance.now();
        const tick = () => {
          setState((s) => ({
            ...s,
            elapsedSec: (performance.now() - startAt) / 1000,
          }));
          tickRef.current = requestAnimationFrame(tick);
        };
        tick();
      };
      rec.onstop = () => {
        if (tickRef.current) cancelAnimationFrame(tickRef.current);
      };
      recRef.current = rec;
      setState({ status: 'recording', elapsedSec: 0 });
      rec.start();
    } catch (err: any) {
      setState({
        status: 'error',
        elapsedSec: 0,
        error: err?.message || 'Microphone access denied',
      });
    }
  };

  const stop = async (): Promise<Blob | null> => {
    if (!recRef.current || state.status !== 'recording') return null;
    setState((s) => ({ ...s, status: 'stopping' }));
    const rec = recRef.current;
    const stream = mediaRef.current;
    const result = await new Promise<Blob | null>((resolve) => {
      const handleStop = () => {
        const blob = new Blob(chunksRef.current, {
          type: rec.mimeType || 'audio/webm',
        });
        resolve(blob);
      };
      rec.addEventListener('stop', handleStop, { once: true });
      try {
        rec.stop();
      } catch {
        resolve(null);
      }
    });
    stream?.getTracks?.().forEach((t) => t.stop());
    mediaRef.current = null;
    recRef.current = null;
    chunksRef.current = [];
    setState({ status: 'idle', elapsedSec: 0 });
    return result;
  };

  return { state, start, stop } as const;
}

function formatElapsed(sec: number) {
  const s = Math.floor(sec % 60);
  const m = Math.floor(sec / 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function LanguageConversationApp() {
  const { openSubWindow, activeId } = useWindowContext();
  const [lang, setLang] = useState<Lang>('en');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState('');
  const { state, start, stop } = useRecorder();
  const [connectedAt] = useState<number>(() => Date.now());

  const cfg = useMemo(() => {
    if (lang === 'ja') {
      return {
        name: '日本語先生',
        subtitle: '会話練習。AIは後で統合。',
        record: '録音',
        stop: '停止',
        placeholder: 'メッセージを入力…',
        send: '送信',
        ready: '準備OK',
        recording: '録音中…',
        flag: '🇯🇵',
      } as const;
    }
    return {
      name: 'English Tutor',
      subtitle: 'Practice speaking. AI integrates later.',
      record: 'Record',
      stop: 'Stop',
      placeholder: 'Type a message…',
      send: 'Send',
      ready: 'Ready',
      recording: 'Recording…',
      flag: '🇬🇧',
    } as const;
  }, [lang]);

  const callElapsed = useMemo(() => {
    const diff = Math.floor((Date.now() - connectedAt) / 1000);
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, [connectedAt, messages.length, state.elapsedSec]);

  const onToggleRecord = async () => {
    if (state.status === 'recording') {
      const blob = await stop();
      if (blob) {
        const url = URL.createObjectURL(blob);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            kind: 'audio',
            audioUrl: url,
            ts: Date.now(),
          },
        ]);
      }
      return;
    }
    await start();
  };

  const onSendText = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), kind: 'text', text, ts: Date.now() },
    ]);
    setDraft('');
  };

  return (
    <div className="bg-background text-foreground flex h-full items-center justify-center">
      <div className="bg-card w-full max-w-md rounded-2xl border p-6 shadow-sm">
        {/* Language switch */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            {lang === 'en' ? 'English' : '日本語'}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">🇬🇧</span>
            <Switch
              checked={lang === 'ja'}
              onCheckedChange={(v) => setLang(v ? 'ja' : 'en')}
            />
            <span className="text-base">🇯🇵</span>
          </div>
        </div>

        {/* Call UI */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-muted ring-background mb-4 flex h-28 w-28 shrink-0 items-center justify-center rounded-full text-4xl ring-8">
            <span aria-hidden>{cfg.flag}</span>
          </div>
          <div className="text-lg font-semibold">{cfg.name}</div>
          <div className="text-muted-foreground text-xs">{cfg.subtitle}</div>

          <div className="text-muted-foreground mt-2 text-xs">
            <span className="inline-flex items-center gap-1 align-middle">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" />
              Connected · {callElapsed}
            </span>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              variant={state.status === 'recording' ? 'destructive' : 'default'}
              onClick={onToggleRecord}
              className="h-16 w-16 rounded-full p-0 text-base"
              title={state.status === 'recording' ? cfg.stop : cfg.record}
            >
              {state.status === 'recording' ? (
                <StopCircle className="h-7 w-7" />
              ) : (
                <Mic className="h-7 w-7" />
              )}
            </Button>
            <Button
              variant="secondary"
              className="rounded-full"
              onClick={() => {
                if (!activeId) return;
                openSubWindow(activeId, {
                  title: lang === 'en' ? 'Call Info' : '通話情報',
                  content: (
                    <div className="p-4 text-sm">
                      <div className="mb-2 font-medium">
                        {lang === 'en' ? 'Session Details' : 'セッション詳細'}
                      </div>
                      <div className="text-muted-foreground">
                        {lang === 'en' ? 'Language' : '言語'}:{' '}
                        {lang === 'en' ? 'English' : '日本語'}
                      </div>
                      <div className="text-muted-foreground">
                        {lang === 'en' ? 'Connected' : '接続中'}: {callElapsed}
                      </div>
                      <div className="text-muted-foreground mt-3 text-xs">
                        {lang === 'en'
                          ? 'AI features will be connected later.'
                          : 'AI機能は後で統合されます。'}
                      </div>
                    </div>
                  ),
                  width: 420,
                  height: 260,
                });
              }}
            >
              {lang === 'en' ? 'Info' : '情報'}
            </Button>
          </div>

          <div className="text-muted-foreground mt-2 text-xs">
            {state.status === 'recording'
              ? `${cfg.recording} ${formatElapsed(state.elapsedSec)}`
              : cfg.ready}
          </div>

          {/* Optional text message input */}
          <div className="mt-6 flex w-full items-center gap-2">
            <Input
              placeholder={cfg.placeholder}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSendText();
                }
              }}
            />
            <Button onClick={onSendText} disabled={!draft.trim()}>
              <Send className="mr-2 h-4 w-4" /> {cfg.send}
            </Button>
          </div>

          {/* History mini-list */}
          {!!messages.length && (
            <div className="mt-6 w-full space-y-2">
              {messages.slice(-5).map((m) => (
                <div
                  key={m.id}
                  className="bg-muted rounded-md px-3 py-2 text-left text-sm"
                >
                  {m.kind === 'text' && (
                    <div className="whitespace-pre-wrap">{m.text}</div>
                  )}
                  {m.kind === 'audio' && (
                    <audio src={m.audioUrl} controls className="w-full" />
                  )}
                </div>
              ))}
            </div>
          )}

          {state.status === 'error' && (
            <div className="text-destructive mt-3 text-xs">
              <MicOff className="mr-1 inline-block h-3 w-3" /> {state.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
