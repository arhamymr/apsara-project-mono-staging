'use client';

import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import {
  ChevronDown,
  Code,
  Dot,
  FileText,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  PanelLeft,
  Plus,
  Quote,
  Save,
  Search,
  Split,
  Strikethrough,
  TextQuote,
  Type,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ---------- Single-source styled atoms ----------
const ActionButton = (props: React.ComponentProps<typeof Button>) => (
  <Button
    size="icon"
    variant="ghost"
    className="h-8 w-8 rounded-md"
    {...props}
  />
);

const NoteTitleInput = (props: React.ComponentProps<typeof Input>) => (
  <Input
    className="border-0 bg-transparent text-lg font-semibold text-white shadow-none focus-visible:ring-0"
    {...props}
  />
);

// ---------- Types & seed ----------
type Note = {
  id: number;
  title: string;
  content: string;
  createdAt: string; // ISO
  updatedAt: string;
  isOpen?: boolean;
};

const nowIso = () => new Date().toISOString();

const seed: Note[] = [
  {
    id: 1,
    title: 'Welcome to Markdown',
    content: `# Hello Markdown!\n\nUse the toolbar (or shortcuts) to format.\n\n**Shortcuts**\n- ⌘/Ctrl+N: New note\n- ⌘/Ctrl+S: Save\n- ⌘/Ctrl+W: Close tab\n- ⌘/Ctrl+P: Quick switch\n- ⌘/Ctrl+B: Bold\n- ⌘/Ctrl+I: Italic\n\n\n> Tip: Switch modes: Edit • Split • Preview.\n\n\`\`\`ts\nconst hello: string = 'world'\n\`\`\`\n`,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    isOpen: true,
  },
  {
    id: 2,
    title: 'Meeting Notes',
    content:
      '## Agenda\n\n- [ ] Timeline\n- [x] Budget\n- [ ] Responsibilities\n\n### Links\nhttps://example.com',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    isOpen: true,
  },
];

// ---------- Utils ----------
const formatWhen = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
};

const fuzzyMatch = (q: string, s: string) => {
  q = q.toLowerCase();
  s = s.toLowerCase();
  let i = 0;
  for (const ch of s) if (ch === q[i]) i++;
  return i === q.length;
};

// ---------- Component ----------
export default function NotesApp() {
  // load from localStorage once
  const initial = useMemo<Note[]>(() => {
    if (typeof window === 'undefined') return seed;
    try {
      const raw = localStorage.getItem('notes.sublime');
      if (!raw) return seed;
      const parsed = JSON.parse(raw) as Note[];
      return parsed.length ? parsed : seed;
    } catch {
      return seed;
    }
  }, []);

  const [notes, setNotes] = useState<Note[]>(initial);
  const [selectedId, setSelectedId] = useState<number | null>(
    initial.find((n) => n.isOpen)?.id ?? initial[0]?.id ?? null,
  );

  // editor state
  const selected = notes.find((n) => n.id === selectedId) || null;
  const [title, setTitle] = useState<string>(selected?.title ?? '');
  const [content, setContent] = useState<string>(selected?.content ?? '');
  const [dirty, setDirty] = useState(false);

  // UI state
  const [sidebarQuery, setSidebarQuery] = useState('');
  const [quickOpen, setQuickOpen] = useState(false);
  const [mode, setMode] = useState<'edit' | 'split' | 'preview'>('split');

  // caret / status bar
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const [lineCol, setLineCol] = useState({ line: 1, col: 1 });
  const [softWrap, setSoftWrap] = useState(true);
  const [tabSize, setTabSize] = useState(2);

  // persist
  useEffect(() => {
    localStorage.setItem('notes.sublime', JSON.stringify(notes));
  }, [notes]);

  // sync editor state when selection changes
  useEffect(() => {
    if (!selected) return;
    setTitle(selected.title);
    setContent(selected.content);
    setDirty(false);
  }, [selectedId]);

  // compute gutter line count (for status Ln/Col only)
  const lineCount = useMemo(() => content.split('\n').length, [content]);

  // update Ln/Col from caret
  const updateLineColFromCaret = (idx: number, text: string) => {
    const upTo = text.slice(0, idx);
    const lines = upTo.split('\n');
    const line = lines.length;
    const lastLine = lines[lines.length - 1];
    const col = (lastLine?.length ?? 0) + 1;
    setLineCol({ line, col });
  };

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();
      if (mod && key === 's') {
        e.preventDefault();
        handleSave();
      } else if (mod && key === 'n') {
        e.preventDefault();
        handleCreate();
      } else if (mod && key === 'w') {
        e.preventDefault();
        if (selected) closeTab(selected.id);
      } else if (mod && key === 'p') {
        e.preventDefault();
        setQuickOpen(true);
      } else if (mod && key === 'b') {
        e.preventDefault();
        wrapSelection('**', '**'); // bold
      } else if (mod && key === 'i') {
        e.preventDefault();
        wrapSelection('*', '*'); // italic
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, title, content, dirty, notes]);

  const selectNote = (id: number) => {
    if (dirty) handleSave(); // autosave
    setSelectedId(id);
    setNotes((curr) =>
      curr.map((n) => (n.id === id ? { ...n, isOpen: true } : n)),
    );
  };

  const handleCreate = () => {
    const newNote: Note = {
      id: Date.now(),
      title: 'Untitled',
      content: '',
      createdAt: nowIso(),
      updatedAt: nowIso(),
      isOpen: true,
    };
    setNotes([newNote, ...notes]);
    setSelectedId(newNote.id);
    setTitle(newNote.title);
    setContent('');
    setDirty(false);
  };

  const handleDelete = (id: number) => {
    const next = notes.filter((n) => n.id !== id);
    setNotes(next);
    if (selectedId === id) {
      const alt = next.find((n) => n.isOpen) ?? next[0] ?? null;
      setSelectedId(alt?.id ?? null);
      setTitle(alt?.title ?? '');
      setContent(alt?.content ?? '');
      setDirty(false);
    }
  };

  const handleSave = () => {
    if (!selected) return;
    setNotes((curr) =>
      curr.map((n) =>
        n.id === selected.id
          ? { ...n, title, content, updatedAt: nowIso() }
          : n,
      ),
    );
    setDirty(false);
  };

  const closeTab = (id: number) => {
    setNotes((curr) =>
      curr.map((n) => (n.id === id ? { ...n, isOpen: false } : n)),
    );
    if (selectedId === id) {
      const stillOpen = notes.filter((n) => n.id !== id && n.isOpen);
      const next = stillOpen[0] ?? notes.find((n) => n.id !== id) ?? null;
      setSelectedId(next?.id ?? null);
    }
  };

  const onTitle = (v: string) => {
    setTitle(v);
    setDirty(true);
  };
  const onContent = (v: string) => {
    setContent(v);
    setDirty(true);
  };

  const filtered = useMemo(() => {
    if (!sidebarQuery.trim()) return notes;
    const q = sidebarQuery.trim();
    return notes.filter(
      (n) => fuzzyMatch(q, n.title) || fuzzyMatch(q, n.content.slice(0, 200)),
    );
  }, [notes, sidebarQuery]);

  // ---- Markdown helpers ----
  const wrapSelection = (
    before: string,
    after: string,
    placeholder = 'text',
  ) => {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const hasSelection = start !== end;
    const selectedText = content.slice(start, end) || placeholder;
    const newText =
      content.slice(0, start) +
      before +
      selectedText +
      after +
      content.slice(end);
    onContent(newText);
    const caret =
      start +
      before.length +
      (hasSelection ? selectedText.length : placeholder.length);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(caret, caret);
      updateLineColFromCaret(caret, newText);
    });
  };

  const prefixLines = (prefix: string) => {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const lines = content.split('\n');
    let pos = 0;
    let newContent = '';
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? '';
      const lineStart = pos;
      const lineEnd = pos + line.length;
      const within = !(end < lineStart || start > lineEnd + 1);
      newContent += within ? prefix + line : line;
      if (i < lines.length - 1) newContent += '\n';
      pos = lineEnd + 1;
    }
    onContent(newContent);
    requestAnimationFrame(() => ta.focus());
  };

  const insertBlock = (snippet: string) => {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const newText = content.slice(0, start) + snippet + content.slice(end);
    onContent(newText);
    const caret = start + snippet.length;
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(caret, caret);
      updateLineColFromCaret(caret, newText);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const spaces = ' '.repeat(tabSize);
      wrapSelection(spaces, '', spaces);
    }
  };

  // styles: Monokai-ish base
  return (
    <div className="flex h-full min-h-[560px] bg-[rgb(39,40,34)] text-[rgb(248,248,242)]">
      {/* Sidebar */}
      <div className="w-72 border-r border-white/10 bg-black/20">
        <div className="border-b border-white/10 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wide text-white/90">
              EXPLORER
            </h2>
            <ActionButton onClick={handleCreate} aria-label="New note">
              <Plus className="h-4 w-4" />
            </ActionButton>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-white/5 px-2 py-1.5">
            <Search className="h-4 w-4 text-white/50" />
            <input
              className="w-full bg-transparent text-xs text-white/80 outline-none placeholder:text-white/40"
              placeholder="Search notes…"
              value={sidebarQuery}
              onChange={(e) => setSidebarQuery(e.target.value)}
            />
          </div>
          <div className="mt-1 text-[10px] tracking-wider text-white/40 uppercase">
            {filtered.length} note{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="h-[calc(100%-88px)] overflow-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-sm text-white/60">
              No results
            </div>
          ) : (
            <ul className="space-y-1">
              {filtered.map((note) => (
                <li key={note.id}>
                  <button
                    onClick={() => selectNote(note.id)}
                    className={[
                      'group w-full rounded-md p-2 text-left transition',
                      selectedId === note.id
                        ? 'bg-[rgb(73,72,62)]/50 text-white shadow-inner'
                        : 'text-white/80 hover:bg-white/5',
                    ].join(' ')}
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-1">
                        <FileText className="h-4 w-4 text-[rgb(166,226,46)]/80" />
                        <span className="truncate text-sm">
                          {note.title || 'Untitled'}
                        </span>
                        {selectedId === note.id && dirty && (
                          <Dot className="-ml-1 h-5 w-5 text-[rgb(253,151,31)]" />
                        )}
                      </div>
                      <ActionButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(note.id);
                        }}
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-red-500/20"
                        aria-label="Delete note"
                      >
                        <X className="h-3.5 w-3.5" />
                      </ActionButton>
                    </div>
                    <p className="line-clamp-2 text-xs text-white/50">
                      {note.content || 'Empty note'}
                    </p>
                    <p className="mt-1 text-[10px] text-white/35">
                      {formatWhen(note.updatedAt)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Tabs bar + Mode switch */}
        <div className="flex items-center gap-1 border-b border-white/10 bg-black/20 px-2">
          {notes
            .filter((n) => n.isOpen)
            .map((n) => {
              const active = n.id === selectedId;
              const isDirty = active ? dirty : false;
              return (
                <button
                  key={n.id}
                  onClick={() => selectNote(n.id)}
                  className={[
                    'group relative flex max-w-[220px] items-center gap-2 rounded-t-md px-3 py-2 text-sm',
                    active
                      ? 'bg-[rgb(73,72,62)]/60 text-white'
                      : 'text-white/70 hover:bg-white/5',
                  ].join(' ')}
                >
                  <span className="truncate">{n.title || 'Untitled'}</span>
                  {isDirty && <span className="text-[rgb(253,151,31)]">●</span>}
                  <X
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(n.id);
                    }}
                    className="ml-1 h-3.5 w-3.5 opacity-0 group-hover:opacity-100"
                  />
                </button>
              );
            })}
          <div className="ml-auto flex items-center gap-1 pr-2">
            <Button
              onClick={handleSave}
              size="sm"
              disabled={!dirty}
              className="h-8"
            >
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
            {/* Mode toggle */}
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant={mode === 'edit' ? 'default' : 'ghost'}
                className="h-8"
                onClick={() => setMode('edit')}
                title="Edit only"
              >
                <Type className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button
                size="sm"
                variant={mode === 'split' ? 'default' : 'ghost'}
                className="h-8"
                onClick={() => setMode('split')}
                title="Split view"
              >
                <Split className="mr-2 h-4 w-4" /> Split
              </Button>
              <Button
                size="sm"
                variant={mode === 'preview' ? 'default' : 'ghost'}
                className="h-8"
                onClick={() => setMode('preview')}
                title="Preview only"
              >
                <PanelLeft className="mr-2 h-4 w-4" /> Preview
              </Button>
            </div>
            {/* Wrap toggle & tab size */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSoftWrap((s) => !s)}
              className="h-8 text-xs"
              title="Toggle soft wrap"
            >
              Wrap: {softWrap ? 'On' : 'Off'}
            </Button>
            <div className="group relative">
              <Button size="sm" variant="ghost" className="h-8 text-xs">
                Spaces: {tabSize} <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
              <div className="invisible absolute right-0 z-10 mt-1 w-24 rounded-md border border-white/10 bg-black/70 p-1 group-hover:visible">
                {[2, 4, 8].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setTabSize(sz)}
                    className={`w-full rounded px-2 py-1 text-left text-xs hover:bg-white/10 ${
                      tabSize === sz ? 'text-white' : 'text-white/70'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Title bar for current note */}
        {selected && (
          <div className="border-b border-white/10 bg-black/10 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[rgb(166,226,46)]/80" />
                <NoteTitleInput
                  value={title}
                  onChange={(e) => onTitle(e.target.value)}
                  placeholder="Note title…"
                />
              </div>
              <div className="text-xs text-white/50">
                Last updated: {new Date(selected.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Toolbar */}
        {selected && (
          <div className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-[rgb(30,31,26)] px-2 py-1.5 text-[11px] text-white/90">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => wrapSelection('**', '**')}
              title="Bold (⌘/Ctrl+B)"
            >
              <strong>B</strong>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => wrapSelection('*', '*')}
              title="Italic (⌘/Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => wrapSelection('~~', '~~')}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <span className="mx-1 h-5 w-px bg-white/10" />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => insertBlock('# ')}
              title="H1"
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => insertBlock('## ')}
              title="H2"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => insertBlock('### ')}
              title="H3"
            >
              <Heading3 className="h-4 w-4" />
            </Button>
            <span className="mx-1 h-5 w-px bg-white/10" />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => prefixLines('- ')}
              title="Bullet list"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => prefixLines('1. ')}
              title="Numbered list"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => prefixLines('> ')}
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => wrapSelection('`', '`', 'code')}
              title="Inline code"
            >
              <Code className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => insertBlock('\n```\n// code\n```\n')}
              title="Code block"
            >
              <TextQuote className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => wrapSelection('[', '](https://)', 'link text')}
              title="Link"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Editor + Preview */}
        {selected ? (
          <div className="relative flex min-h-0 flex-1">
            {mode !== 'preview' && (
              <div
                className={`flex min-w-0 flex-1 ${mode === 'split' ? 'md:w-1/2' : 'w-full'}`}
              >
                <textarea
                  ref={taRef}
                  value={content}
                  onChange={(e) => {
                    const v = e.target.value.replace(
                      /\t/g,
                      ' '.repeat(tabSize),
                    );
                    onContent(v);
                    const idx = e.currentTarget.selectionStart ?? 0;
                    updateLineColFromCaret(idx, v);
                  }}
                  onClick={(e) => {
                    const idx =
                      (e.target as HTMLTextAreaElement).selectionStart ?? 0;
                    updateLineColFromCaret(idx, content);
                  }}
                  onKeyUp={(e) => {
                    const idx =
                      (e.target as HTMLTextAreaElement).selectionStart ?? 0;
                    updateLineColFromCaret(idx, content);
                  }}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  className={[
                    'h-full w-full resize-none bg-transparent px-4 py-3 outline-none',
                    'font-mono text-sm leading-6 text-[rgb(248,248,242)] caret-[rgb(253,151,31)]',
                    softWrap
                      ? 'break-words whitespace-pre-wrap'
                      : 'whitespace-pre',
                  ].join(' ')}
                  placeholder="Write Markdown…"
                />
              </div>
            )}

            {mode !== 'edit' && (
              <div
                className={`min-w-0 border-l border-white/10 bg-black/20 ${mode === 'split' ? 'hidden md:block md:w-1/2' : 'w-full'}`}
              >
                <div className="h-full overflow-auto p-6">
                  <article className="prose prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ className, children, ...props }) {
                          const isInline = !className?.includes('language-');
                          return isInline ? (
                            <code
                              className="rounded bg-white/10 px-1 py-0.5 text-[0.85em]"
                              {...props}
                            >
                              {children}
                            </code>
                          ) : (
                            <pre
                              className="overflow-x-auto rounded-md border border-white/10 bg-black/40 p-3 text-[0.85em]"
                            >
                              <code className={className} {...props}>{children}</code>
                            </pre>
                          );
                        },
                        a({ children, ...props }) {
                          return (
                            <a
                              className="text-[rgb(166,226,46)] underline underline-offset-2"
                              target="_blank"
                              rel="noreferrer"
                              {...props}
                            >
                              {children}
                            </a>
                          );
                        },
                        hr() {
                          return <hr className="my-6 border-white/10" />;
                        },
                        blockquote({ children }) {
                          return (
                            <blockquote className="border-l-2 border-white/20 pl-4 text-white/80">
                              {children}
                            </blockquote>
                          );
                        },
                      }}
                    >
                      {content || '_Nothing to preview…_'}
                    </ReactMarkdown>
                  </article>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <FileText className="mx-auto mb-4 h-16 w-16 text-white/20" />
              <p className="text-lg text-white/60">No note selected</p>
              <p className="text-sm text-white/40">
                Select a note or create a new one
              </p>
            </div>
          </div>
        )}

        {/* Status bar */}
        <div className="flex items-center justify-between border-t border-white/10 bg-[rgb(30,31,26)] px-3 py-1.5 text-[11px] text-white/70">
          <div className="flex items-center gap-3">
            <span>
              Ln {lineCol.line}, Col {lineCol.col}
            </span>
            <span>UTF-8</span>
            <span>LF</span>
            <span>Spaces: {tabSize}</span>
            <span>Markdown</span>
          </div>
          <div className="flex items-center gap-3">
            {dirty ? (
              <span className="text-[rgb(253,151,31)]">● Unsaved</span>
            ) : (
              <span className="text-[rgb(166,226,46)]">Saved</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Switch (Cmd/Ctrl+P) */}
      <Dialog open={quickOpen} onOpenChange={setQuickOpen}>
        <DialogContent className="border-white/10 bg-[rgb(39,40,34)] text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-sm text-white/70">
              Quick Switch
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 rounded-md bg-white/5 px-2 py-2">
            <Search className="h-4 w-4 text-white/50" />
            <input
              autoFocus
              className="w-full bg-transparent text-sm text-white/90 outline-none placeholder:text-white/40"
              placeholder="Type to fuzzy find a note…"
              onChange={(e) => setSidebarQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const first = filtered[0];
                  if (first) {
                    selectNote(first.id);
                    setQuickOpen(false);
                  }
                }
              }}
            />
          </div>
          <div className="max-h-64 overflow-auto">
            {filtered.slice(0, 10).map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  selectNote(n.id);
                  setQuickOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left hover:bg-white/5"
              >
                <span className="truncate">{n.title || 'Untitled'}</span>
                <span className="ml-3 text-xs text-white/40">
                  {formatWhen(n.updatedAt)}
                </span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dependencies:
//  npm i react-markdown remark-gfm
// Tailwind note: optional typography plugin for nicer preview: @tailwindcss/typography
// (If not using the plugin, the component still renders with the custom classes above.)
