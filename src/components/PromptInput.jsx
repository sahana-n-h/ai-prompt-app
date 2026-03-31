import { useState, useRef, useEffect } from 'react';

// Textarea input with submit and clear actions
export default function PromptInput({ onSubmit, onClear, isLoading, hasHistory }) {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize as user types
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [prompt]);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
    setPrompt('');
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm transition-colors duration-200 focus-within:border-sn-red" style={{borderColor: '#E0E3E5'}}>
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about travel…"
          disabled={isLoading}
          rows={2}
          className="w-full resize-none bg-transparent text-sm leading-relaxed outline-none disabled:opacity-50"
          style={{color: '#202020'}}
        />

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs select-none text-sn-muted">
            Press <kbd className="rounded px-1 py-0.5" style={{background:'#F0F3F5', color:'#717273'}}>⌘ Enter</kbd> to send
          </span>

          <div className="flex items-center gap-2">
            {hasHistory && (
              <button
                type="button"
                onClick={onClear}
                disabled={isLoading}
                className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed hover:border-red-400 hover:text-red-500"
                style={{borderColor: '#E0E3E5', color: '#717273'}}
              >
                Clear History
              </button>
            )}
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-semibold text-white shadow transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{backgroundColor: '#CB333B'}}
              onMouseEnter={e => e.currentTarget.style.backgroundColor='#A0282F'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor='#CB333B'}
            >
              {isLoading ? (
                <>
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending…
                </>
              ) : (
                <>
                  Send
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
