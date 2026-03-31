import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

/**
 * Scrollable chat history. Auto-scrolls on new messages.
 */
export default function ChatHistory({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) return null;

  return (
    <div className="flex w-full flex-col gap-4 overflow-y-auto scrollbar-thin">
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          role={msg.role}
          content={msg.content}
          timestamp={msg.timestamp}
        />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
