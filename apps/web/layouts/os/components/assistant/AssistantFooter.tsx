import type { Mode } from './chat/chat-header';
import { ChatInputComp } from './chat/chat-input';
import SearchInput from './search/SearchInput';

type Props = {
  mode: Mode;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSendChat: (value: string) => void | Promise<void>;
};

export default function AssistantFooter({
  mode,
  searchQuery,
  onSearchQueryChange,
  onSendChat,
}: Props) {
  return (
    <div className="bg-background sticky bottom-0 border p-3">
      {mode === 'search' ? (
        <SearchInput value={searchQuery} onChange={onSearchQueryChange} />
      ) : (
        <ChatInputComp />
      )}
    </div>
  );
}
