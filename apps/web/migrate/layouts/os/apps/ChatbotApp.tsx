import Chatbot from '@/layouts/os/apps/chatbot';

export default function ChatbotApp() {
  return (
    <div className="bg-background text-foreground flex h-full flex-col overflow-hidden rounded-sm">
      <div className="flex-1 overflow-auto">
        <Chatbot />
      </div>
    </div>
  );
}
