import { Loader2, Wrench } from 'lucide-react';

interface ChatStreamingMessageProps {
  content: string;
  activeTools?: string[];
}

export function ChatStreamingMessage({
  content,
  activeTools = [],
}: ChatStreamingMessageProps) {
  const hasTools = activeTools.length > 0;
  const displayContent = content || 'Thinking...';

  return (
    <div className="flex justify-start gap-3">
      <div className="bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold">
        AI
      </div>
      <div className="bg-muted text-foreground max-w-[70%] rounded-lg px-4 py-2">
        <div className="text-sm">
          <p className="whitespace-pre-wrap">{displayContent}</p>
        </div>

        {/* Active Tools Display */}
        {hasTools && (
          <div className="border-border mt-3 border-t pt-2">
            <div className="text-muted-foreground mb-1.5 flex items-center gap-1.5 text-xs">
              <Wrench size={12} className="animate-pulse" />
              <span className="font-medium">Using tools:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeTools.map((toolName) => (
                <span
                  key={toolName}
                  className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-xs"
                >
                  <Loader2 size={10} className="animate-spin" />
                  {toolName}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-1 flex items-center gap-1">
          <Loader2 size={12} className="animate-spin" />
          <span className="text-muted-foreground text-xs">
            {hasTools ? 'Executing...' : 'Streaming...'}
          </span>
        </div>
      </div>
    </div>
  );
}
