// Animated dots shown while waiting for a response
export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 rounded-2xl px-4 py-3 border" style={{backgroundColor: '#ffffff', borderColor: '#E0E3E5', borderRadius: '4px 16px 16px 16px'}}>
        <span className="h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]" style={{backgroundColor: '#CB333B'}} />
        <span className="h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]" style={{backgroundColor: '#CB333B'}} />
        <span className="h-2 w-2 animate-bounce rounded-full" style={{backgroundColor: '#CB333B'}} />
      </div>
    </div>
  );
}
