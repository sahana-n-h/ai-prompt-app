/**
 * Slide-over sidebar showing all saved conversations.
 * Props:
 *   isOpen: boolean
 *   onClose: () => void
 *   conversations: Conversation[]
 *   activeId: string | null
 *   onLoad: (conversation) => void
 *   onDelete: (id) => void
 *   onNewChat: () => void
 */
export default function ConversationHistoryPanel({
  isOpen,
  onClose,
  conversations,
  activeId,
  onLoad,
  onDelete,
  onNewChat,
}) {
  function formatDate(iso) {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/20 backdrop-blur-[1px] transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <aside
        className={`fixed top-0 left-0 z-30 flex h-full w-72 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Chat history"
      >
        {/* Panel header */}
        <div
          className="flex items-center justify-between border-b px-4 py-4"
          style={{ borderColor: '#E0E3E5' }}
        >
          <div className="flex items-center gap-2">
            {/* Clock icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              style={{ color: '#CB333B' }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <h2 className="text-sm font-semibold" style={{ color: '#202020' }}>
              Chat History
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-sm transition-colors hover:bg-gray-100"
            style={{ color: '#717273' }}
            aria-label="Close history panel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* New Chat button */}
        <div className="px-3 pt-3 pb-2">
          <button
            onClick={() => { onNewChat(); onClose(); }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium transition-colors hover:border-sn-red hover:text-sn-red"
            style={{ borderColor: '#E0E3E5', color: '#717273' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#CB333B'; e.currentTarget.style.color='#CB333B'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#E0E3E5'; e.currentTarget.style.color='#717273'; }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                style={{ color: '#E0E3E5' }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p className="text-xs leading-relaxed" style={{ color: '#717273' }}>
                No saved conversations yet.
                <br />
                Start chatting to see your history here.
              </p>
            </div>
          ) : (
            <ul className="space-y-1 mt-1">
              {conversations.map((conv) => (
                <li key={conv.id}>
                  <div
                    className={`group flex w-full items-start gap-2 rounded-lg px-3 py-2.5 text-left transition-colors cursor-pointer ${
                      conv.id === activeId
                        ? 'bg-red-50'
                        : 'hover:bg-gray-50'
                    }`}
                    style={conv.id === activeId ? { borderLeft: '3px solid #CB333B' } : { borderLeft: '3px solid transparent' }}
                    onClick={() => { onLoad(conv); onClose(); }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && (onLoad(conv), onClose())}
                  >
                    <div className="flex-1 min-w-0">
                      <p
                        className="truncate text-xs font-medium leading-snug"
                        style={{ color: conv.id === activeId ? '#CB333B' : '#202020' }}
                      >
                        {conv.title}
                      </p>
                      <p className="mt-0.5 text-[10px]" style={{ color: '#717273' }}>
                        {formatDate(conv.updatedAt || conv.createdAt)}
                        {' · '}
                        {conv.messages.length} message{conv.messages.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                      className="mt-0.5 shrink-0 rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      style={{ color: '#717273' }}
                      aria-label="Delete conversation"
                      onMouseEnter={e => e.currentTarget.style.color='#CB333B'}
                      onMouseLeave={e => e.currentTarget.style.color='#717273'}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {conversations.length > 0 && (
          <div className="border-t px-4 py-3" style={{ borderColor: '#E0E3E5' }}>
            <p className="text-[10px] text-center" style={{ color: '#717273' }}>
              {conversations.length} saved conversation{conversations.length !== 1 ? 's' : ''} · stored locally
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
