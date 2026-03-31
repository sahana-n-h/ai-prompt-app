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

  const { conversations, saveConversation, deleteConversation, clearAll } = useConversations();

  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const activeConvIdRef = useRef(activeConvId);
  activeConvIdRef.current = activeConvId;

  const handleSubmit = useCallback(async (prompt) => {
    const userMsg = createMessage('user', prompt);
    const nextMessages = [...messagesRef.current, userMsg];
    messagesRef.current = nextMessages;
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      const responseText = await fetchAIResponse(prompt, API_KEY);
      const aiMsg = createMessage('assistant', responseText);
      const withResponse = [...messagesRef.current, aiMsg];
      messagesRef.current = withResponse;
      setMessages(withResponse);

      // Call saveConversation outside a state updater to avoid double-save
      // under React Strict Mode
      const savedId = saveConversation(withResponse, activeConvIdRef.current);
      if (savedId) {
        activeConvIdRef.current = savedId;
        setActiveConvId(savedId);
      }
    } catch (err) {
      const errMsg = createMessage('error', err.message);
      const withError = [...messagesRef.current, errMsg];
      messagesRef.current = withError;
      setMessages(withError);

      // Save even on error so the user prompt is preserved in history
      const savedId = saveConversation(withError, activeConvIdRef.current);
      if (savedId) {
        activeConvIdRef.current = savedId;
        setActiveConvId(savedId);
      }
    } finally {
      setIsLoading(false);
    }
  }, [saveConversation]);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    messagesRef.current = [];
    setActiveConvId(null);
    activeConvIdRef.current = null;
  }, []);

  const handleDeleteConversation = useCallback((id) => {
    deleteConversation(id);
    // If the deleted conversation is the one currently open, reset to a new chat
    // and close the history panel
    if (id === activeConvIdRef.current) {
      setMessages([]);
      messagesRef.current = [];
      setActiveConvId(null);
      activeConvIdRef.current = null;
      setIsHistoryOpen(false);
    }
  }, [deleteConversation]);

  const handleClearAll = useCallback(() => {
    clearAll();
    setMessages([]);
    messagesRef.current = [];
    setActiveConvId(null);
    activeConvIdRef.current = null;
  }, [clearAll]);

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
        onDelete={handleDeleteConversation}
        onNewChat={handleNewChat}
        onClearAll={handleClearAll}
      />

      <Header
        onToggleHistory={() => setIsHistoryOpen((v) => !v)}
        historyCount={conversations.length}
      />

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-8 max-w-3xl w-full mx-auto">
          {messages.length === 0 && !isLoading ? (
            <EmptyState onSuggestion={handleSubmit} />
          ) : (
            <ChatHistory messages={messages} isLoading={isLoading} />
          )}
        </div>

        <div className="border-t bg-white px-4 py-4 sm:px-8" style={{borderColor: '#E0E3E5'}}>
          <div className="max-w-3xl mx-auto">
            <PromptInput
              onSubmit={handleSubmit}
              isLoading={isLoading}
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
