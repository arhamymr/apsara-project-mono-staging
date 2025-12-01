import { ConfirmModal } from '@/components/modal/confirm';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Plus, RefreshCcw, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { KBCollection, KnowledgeBase } from './types';

type KnowledgeSidebarProps = {
  knowledgeBases: KnowledgeBase[];
  collections: KBCollection[];
  selectedKbId: string | null;
  selectedCollectionId: string | null;
  onSelectKb: (kbId: string) => void;
  onSelectCollection: (collectionId: string) => void;
  onCreateKb: () => void;
  onCreateCollection: () => void;
  onCreateCollectionFor: (kbId: string) => void;
  onDeleteKb: (kbId: number) => void;
  search: string;
  onSearch: (value: string) => void;
  onClearSearch: () => void;
  isLoading: boolean;
  isFetching: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  portalContainer?: HTMLElement | null;
};

export function KnowledgeSidebar({
  knowledgeBases,
  collections,
  selectedKbId,
  selectedCollectionId,
  onSelectKb,
  onSelectCollection,
  onCreateKb,
  onCreateCollection,
  onCreateCollectionFor,
  onDeleteKb,
  search,
  onSearch,
  onClearSearch,
  isLoading,
  isFetching,
  errorMessage,
  onRetry,
  portalContainer,
}: KnowledgeSidebarProps) {
  const [kbPendingDelete, setKbPendingDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const filteredCollections = useMemo(() => {
    const matchCollections = collections
      .filter((collection) =>
        !search
          ? true
          : collection.name.toLowerCase().includes(search.toLowerCase()),
      )
      .reduce<Record<string, KBCollection[]>>((acc, collection) => {
        if (!acc[collection.kbId]) {
          acc[collection.kbId] = [];
        }
        acc[collection.kbId]?.push(collection);
        return acc;
      }, {});

    return matchCollections;
  }, [collections, search]);

  return (
    <div className="h-full overflow-hidden p-3">
      <div className="">
        <div className="mt-2 mb-4 flex items-center gap-2">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 opacity-60" />
            <Input
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search collections"
              className="pl-8"
            />
          </div>
          <Button size="icon" variant="ghost" onClick={onClearSearch}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div>
        <ScrollArea className="h-[calc(100vh-220px)]">
          {errorMessage ? (
            <div className="text-destructive flex flex-col items-center gap-2 px-4 py-6 text-center text-sm">
              <span>{errorMessage}</span>
              <Button variant="outline" size="sm" onClick={onRetry}>
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="text-muted-foreground px-4 py-6 text-center text-sm">
              Loading knowledge bases...
            </div>
          ) : knowledgeBases.length === 0 ? (
            <div className="text-muted-foreground px-4 py-6 text-center text-sm">
              No knowledge bases yet — create one to get started.
            </div>
          ) : (
            <Accordion
              type="single"
              collapsible
              value={selectedKbId ?? undefined}
              onValueChange={(value) => (value ? onSelectKb(value) : null)}
            >
              {knowledgeBases.map((kb) => (
                <AccordionItem
                  key={kb.id}
                  value={kb.id}
                  className="border-none"
                >
                  <AccordionTrigger className="hover:bg-muted/20 border-b px-2 text-left">
                    <div className="flex w-full items-center justify-between gap-2 pr-2">
                      <span className="truncate">{kb.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="ml-2 shrink-0">
                          {kb.collectionsCount ?? 0} col
                        </Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive h-6 w-6"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setKbPendingDelete({ id: kb.id, name: kb.name });
                          }}
                          title="Delete knowledge base"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-2">
                    <div className="space-y-1">
                      {filteredCollections[kb.id]?.map((collection) => (
                        <Button
                          key={collection.id}
                          variant={
                            collection.id === selectedCollectionId
                              ? 'secondary'
                              : 'ghost'
                          }
                          size="sm"
                          className="w-full justify-between"
                          onClick={() => onSelectCollection(collection.id)}
                        >
                          <span className="truncate text-left">
                            {collection.name}
                          </span>
                          <Badge variant="outline">
                            {collection.sourcesCount ?? 0}
                          </Badge>
                        </Button>
                      ))}
                      {!filteredCollections[kb.id]?.length && (
                        <p className="text-muted-foreground py-2 pl-2 text-xs">
                          No collections
                        </p>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground w-full justify-start gap-2"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          onCreateCollectionFor(kb.id);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        Add collection
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </ScrollArea>
      </div>
      <ConfirmModal
        isOpen={!!kbPendingDelete}
        title={
          kbPendingDelete
            ? `Delete knowledge base "${kbPendingDelete.name}"?`
            : 'Delete knowledge base?'
        }
        message="This action cannot be undone. All collections and sources in this knowledge base will be removed."
        confirmText="Delete"
        cancelText="Cancel"
        portalContainer={portalContainer}
        onConfirm={() => {
          if (kbPendingDelete) {
            onDeleteKb(Number(kbPendingDelete.id));
          }
          setKbPendingDelete(null);
        }}
        onCancel={() => setKbPendingDelete(null)}
      />
    </div>
  );
}
