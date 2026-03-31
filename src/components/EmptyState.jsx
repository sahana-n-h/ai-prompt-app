// Empty state shown before any messages are sent
export default function EmptyState() {
  const suggestions = [
    'What are the best business travel tips for long-haul flights?',
    'How do I manage a corporate travel policy effectively?',
    'What is Travel-as-a-Service and how does it work?',
    'Help me plan a multi-city trip itinerary',
  ];

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-16 text-center">
      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border" style={{backgroundColor: '#FDECEA', borderColor: '#CB333B'}}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" style={{color: '#CB333B'}} viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z"/>
        </svg>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-sn-dark">How can I help you travel smarter?</h2>
        <p className="text-sm text-sn-muted max-w-xs">
          Ask anything about travel — or pick a suggestion below to get started.
        </p>
      </div>

      {/* Suggestion chips */}
      <div className="flex flex-wrap justify-center gap-2 max-w-lg">
        {suggestions.map((s) => (
          <span
            key={s}
            className="cursor-default rounded-full border px-3 py-1.5 text-xs transition-colors select-none"
            style={{borderColor: '#E0E3E5', backgroundColor: '#ffffff', color: '#717273'}}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#CB333B'; e.currentTarget.style.color='#CB333B'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#E0E3E5'; e.currentTarget.style.color='#717273'; }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
