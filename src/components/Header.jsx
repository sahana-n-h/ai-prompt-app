// Header with Spotnana branding
export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm" style={{borderColor: '#E0E3E5'}}>
      <div className="flex items-center gap-3">
        {/* Logo mark */}
        <div className="flex h-8 w-8 items-center justify-center rounded-lg shadow-sm" style={{backgroundColor: '#CB333B'}}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z"/>
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-bold leading-tight tracking-wide" style={{color: '#202020'}}>Spotnana Travel Assistant</h1>
          <p className="text-[11px] leading-tight" style={{color: '#717273'}}>Powered by OpenAI</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full animate-pulse" style={{backgroundColor: '#CB333B'}} />
        <span className="text-xs" style={{color: '#717273'}}>Connected</span>
      </div>
    </header>
  );
}
