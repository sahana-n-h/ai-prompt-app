import { useState, useCallback, useRef } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ChatHistory from './components/ChatHistory';
import EmptyState from './components/EmptyState';
import ConversationHistoryPanel from './components/ConversationHistoryPanel';
import { useConversations } from './hooks/useConversations';
import { fetchAIResponse } from './services/openai';

const API_KEY = import.meta.env.OPENAI_API_KEY;

function getTimestamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

let nextId = 1;
function createMessage(role, content) {
  return { id: nextId++, role, content, timestamp: getTimestamp() };
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeConvId, setActiveConvId] = useState(null);

  const { conversations, saveConversation, deleteConversation } = useConversations();

  // Track the latest messages in a ref so the save-on-blur logic can access them
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const handleSubmit = useCallback(async (prompt) => {
    const userMsg = createMessage('user', prompt);
    setMessages((prev) => {
      const updated = [...prev, userMsg];
      messagesRef.current = updated;
      return updated;
    });
    setIsLoading(true);

    try {
      const responseText = await fetchAIResponse(prompt, API_KEY);
      const aiMsg = createMessage('assistant', responseText);
      setMessages((prev) => {
        const updated = [...prev, aiMsg];
        messagesRef.current = updated;
        return updated;
      });
      // Auto-save after every AI response (outside the state updater)
      setActiveConvId((currentId) => {
        const savedId = saveConversation(messagesRef.current, currentId);
        return savedId ?? currentId;
      });
    } catch (err) {
      const errMsg = createMessage('error', err.message);
      setMessages((prev) => {
        const updated = [...prev, errMsg];
        messagesRef.current = updated;
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }, [saveConversation]);

  /** Start a fresh chat (optionally saving the current one first). */
  const handleNewChat = useCallback(() => {
    setMessages([]);
    setActiveConvId(null);
  }, []);

  /** Clear current chat (same as new chat but triggered from the input). */
  const handleClear = useCallback(() => {
    setMessages([]);
    setActiveConvId(null);
  }, []);

  /** Load a conversation from history. */
  const handleLoadConversation = useCallback((conv) => {
    setMessages(conv.messages);
    setActiveConvId(conv.id);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-sn-gray">
      <ConversationHistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        conversations={conversations}
        activeId={activeConvId}
        onLoad={handleLoadConversation}
        onDelete={deleteConversation}
        onNewChat={handleNewChat}
      />

      <Header
        onToggleHistory={() => setIsHistoryOpen((v) => !v)}
        historyCount={conversations.length}
      />

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-8 max-w-3xl w-full mx-auto">
          {messages.length === 0 && !isLoading ? (
            <EmptyState />
          ) : (
            <ChatHistory messages={messages} isLoading={isLoading} />
          )}
        </div>

        <div className="border-t bg-white px-4 py-4 sm:px-8" style={{borderColor: '#E0E3E5'}}>
          <div className="max-w-3xl mx-auto">
            <PromptInput
              onSubmit={handleSubmit}
              onClear={handleClear}
              isLoading={isLoading}
              hasHistory={messages.length > 0}
            />
            <p className="mt-2 text-center text-[11px] text-sn-muted">
              AI responses may be inaccurate. Always verify important travel information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
