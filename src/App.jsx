import { useState, useCallback } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ChatHistory from './components/ChatHistory';
import EmptyState from './components/EmptyState';
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

  const handleSubmit = useCallback(async (prompt) => {
    const userMsg = createMessage('user', prompt);
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const responseText = await fetchAIResponse(prompt, API_KEY);
      const aiMsg = createMessage('assistant', responseText);
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errMsg = createMessage('error', err.message);
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleClear = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-sn-gray">
      <Header />

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
