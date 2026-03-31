// Chat message bubble — user, assistant, or error
export default function ChatMessage({ role, content, timestamp }) {
  const isUser = role === 'user';
  const isError = role === 'error';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Avatar + label row */}
        <div className={`flex items-center gap-1.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{
              backgroundColor: isUser ? '#202020' : isError ? '#E53E3E' : '#CB333B'
            }}
          >
            {isUser ? 'U' : isError ? '!' : 'S'}
          </div>
          <span className="text-[11px] text-sn-muted">
            {isUser ? 'You' : isError ? 'Error' : 'Spotnana AI'} · {timestamp}
          </span>
        </div>

        {/* Message bubble */}
        <div
          className="rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap wrap-break-word"
          style={
            isUser
              ? { backgroundColor: '#18191B', color: '#ffffff', borderRadius: '16px 4px 16px 16px' }
              : isError
              ? { backgroundColor: '#FFF5F5', color: '#C53030', border: '1px solid #FEB2B2', borderRadius: '4px 16px 16px 16px' }
              : { backgroundColor: '#ffffff', color: '#202020', border: '1px solid #E0E3E5', borderRadius: '4px 16px 16px 16px' }
          }
        >
          {content}
        </div>
      </div>
    </div>
  );
}
