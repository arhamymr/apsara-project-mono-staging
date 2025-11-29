import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useWindowContext } from '@/layouts/os/WindowContext';
import { Code, Loader2, Send } from 'lucide-react';
import VibeCodeEditor from './editor';
import { useVibeCode } from './hooks/use-vibe-code';

export default function VibeCodeRoot() {
  const { openSubWindow, activeId } = useWindowContext();
  const {
    welcomeInput,
    setWelcomeInput,
    isStarting,
    handleStartChat,
    refetchConversations,
    recentConversations,
    isLoadingConversations,
    handleSessionSelect,
  } = useVibeCode();

  const openEditor = (
    sessionId: string,
    title?: string,
    initialMessage?: string,
  ) => {
    if (!activeId) return;

    openSubWindow(activeId, {
      title: title || `Session: ${sessionId.substring(0, 8)}...`,
      content: (
        <VibeCodeEditor sessionId={sessionId} initialMessage={initialMessage} />
      ),
      width: 1200,
      height: 800,
    });
  };

  const handleStartBuilding = async () => {
    if (!welcomeInput.trim()) return;

    const message = welcomeInput.trim();
    const sessionId = await handleStartChat(message);
    if (sessionId) {
      openEditor(sessionId, message, message);
      setWelcomeInput('');
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setWelcomeInput(suggestion);
    const sessionId = await handleStartChat(suggestion);
    if (sessionId) {
      openEditor(sessionId, suggestion, suggestion);
      setWelcomeInput('');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="flex min-h-full w-full flex-col items-center justify-center p-6">
          <h1 className="text-foreground mb-2 text-3xl font-bold">
            Vibe Code Agent
          </h1>
          <p className="text-muted-foreground text-lg">
            Chat with AI to build web applications
          </p>

          <div className="w-full max-w-xl space-y-3 pt-8">
            <Textarea
              value={welcomeInput}
              onChange={(e) => setWelcomeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleStartBuilding();
                }
              }}
              placeholder="What would you like to build? (e.g., Build a todo app with React and Vite...)"
              className="min-h-[120px] resize-none text-base"
              disabled={isStarting}
            />
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                Press <kbd className="bg-muted rounded px-2 py-1">Enter</kbd> to
                send,{' '}
                <kbd className="bg-muted rounded px-2 py-1">Shift+Enter</kbd>{' '}
                for new line
              </p>
              <Button
                onClick={handleStartBuilding}
                disabled={!welcomeInput.trim() || isStarting}
                size="lg"
              >
                {isStarting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Start Building
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="mt-6 w-full max-w-xl space-y-2">
            <p className="text-muted-foreground text-sm">Try these:</p>
            <div className="flex flex-wrap gap-2">
              {[
                'Build a todo app with React and Vite',
                'Create a REST API with Express',
                'Make a Python Flask hello world app',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={isStarting}
                  className="border-border hover:bg-muted rounded-lg border px-4 py-2 text-left text-sm transition-colors disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full max-w-xl space-y-3 pt-12">
            <div className="flex w-full items-center justify-between">
              <h3 className="text-sm font-semibold">Recent Conversations</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetchConversations()}
                disabled={isLoadingConversations}
              >
                {isLoadingConversations ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Refresh'
                )}
              </Button>
            </div>

            {isLoadingConversations ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
              </div>
            ) : recentConversations.length > 0 ? (
              <div className="grid max-h-[400px] gap-2 overflow-y-auto">
                {recentConversations.slice(0, 5).map((conversation) => {
                  const preview =
                    conversation.title ||
                    conversation.first_message?.slice(0, 80) ||
                    'New Conversation';
                  return (
                    <button
                      key={conversation.id}
                      onClick={() => {
                        handleSessionSelect(conversation.id);
                        openEditor(
                          conversation.id,
                          conversation.title || conversation.first_message,
                          undefined, // Don't auto-send for existing sessions
                        );
                      }}
                      className="border-border hover:bg-muted flex items-start gap-3 rounded-lg border p-3 text-left transition-colors"
                    >
                      <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                        <Code className="text-primary h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {preview}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {conversation.message_count || 0} messages
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
                  <Code className="text-muted-foreground h-8 w-8" />
                </div>
                <p className="text-muted-foreground mt-4 text-sm">
                  No conversations yet
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Start building something to see your history here
                </p>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
