"use client";

import { use, useState, useEffect, Suspense } from "react";
import { RoomProvider, useRoom } from "@/components/room-provider";
import { Editor } from "@/components/editor";
import Link from "next/link";

function TopBar({ roomId }: { roomId: string }) {
  const { connected } = useRoom();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <header className="h-12 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
          <span className="font-semibold text-sm text-slate-900">Synthetix</span>
        </Link>
        <div className="w-px h-4 bg-slate-200"></div>
        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span>main-app.ts</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-medium px-2 py-1 bg-slate-50 border border-slate-200 rounded-md">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
          <span className="text-slate-600">{connected ? 'Connected' : 'Connecting...'}</span>
        </div>
        <button 
          onClick={handleShare}
          className="h-8 px-3 text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {copied ? (
              <path d="M20 6L9 17l-5-5"></path>
            ) : (
              <>
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </>
            )}
          </svg>
          {copied ? "Copied!" : "Share"}
        </button>
        <button className="h-8 px-4 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Run
        </button>
      </div>
    </header>
  );
}

function ActiveUsers() {
  const { provider } = useRoom();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!provider) return;
    
    const updateUsers = () => {
      const states = Array.from(provider.awareness.getStates().values());
      const activeUsers = states.filter(s => s.user).map(s => s.user);
      setUsers(activeUsers);
    };

    provider.awareness.on('change', updateUsers);
    updateUsers();

    return () => {
      provider.awareness.off('change', updateUsers);
    };
  }, [provider]);

  return (
    <div className="w-16 lg:w-48 shrink-0 bg-[#f8f9ff] border-r border-slate-200 flex flex-col items-center lg:items-stretch py-4 overflow-y-auto">
      <div className="px-4 mb-4 hidden lg:block text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Collaborators
      </div>
      <div className="flex flex-col gap-2 px-2 lg:px-3">
        {users.map((user, i) => (
          <div key={i} className="flex items-center gap-3 p-1.5 lg:p-2 rounded-lg hover:bg-slate-100/50 cursor-pointer transition-colors group relative" title={user.name}>
            <div 
              className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-white"
              style={{ backgroundColor: user.color || '#0058bc' }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="hidden lg:block overflow-hidden">
              <div className="text-sm font-medium text-slate-700 truncate">{user.name || 'Anonymous'}</div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Online
              </div>
            </div>
            {/* Tooltip for small screens */}
            <div className="lg:hidden absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
              {user.name || 'Anonymous'}
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="px-4 text-xs text-slate-400 hidden lg:block">Waiting...</div>
        )}
      </div>
    </div>
  );
}

function AIPanel() {
  return (
    <div className="hidden lg:flex flex-col w-80 shrink-0 bg-[#f8f9ff] border-l border-slate-200">
      <div className="h-12 border-b border-slate-200 px-4 flex items-center justify-between bg-white/50 shrink-0">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
            <path d="M12 2a2 2 0 0 1 2 2c0 1.1-.9 2-2 2a2 2 0 0 1-2-2c0-1.1.9-2 2-2Z"></path>
            <path d="M10.8 14.8a2.5 2.5 0 0 0 2.4 0l6-3.5a2.5 2.5 0 0 0 1.2-2.2V6.9a2.5 2.5 0 0 0-1.2-2.2l-6-3.5a2.5 2.5 0 0 0-2.4 0l-6 3.5a2.5 2.5 0 0 0-1.2 2.2v2.2a2.5 2.5 0 0 0 1.2 2.2l6 3.5Z"></path>
            <path d="M12 22v-7"></path>
          </svg>
          AI Assistant
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Placeholder Message */}
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-sm bg-blue-100 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                <path d="M12 2a2 2 0 0 1 2 2c0 1.1-.9 2-2 2a2 2 0 0 1-2-2c0-1.1.9-2 2-2Z"></path>
              </svg>
            </div>
            <span className="text-xs font-semibold text-slate-700">Synthetix AI</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            I'm ready to review your code. Click the "Review Code" button below when you want me to analyze the current document for bugs, performance, or style issues.
          </p>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <button className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium py-2.5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
          Review Code
        </button>
      </div>
    </div>
  );
}

import { useSearchParams, useRouter, usePathname } from "next/navigation";

function NamePromptModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const name = searchParams.get("name");
  
  const [inputName, setInputName] = useState("");

  if (name) return null; // Already has a name

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("name", inputName.trim());
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-300">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Synthetix</h2>
        <p className="text-slate-500 mb-8">You're about to join a collaborative session. Please enter your name to start coding together.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="modal-name" className="block text-sm font-semibold text-slate-700 mb-2">Display Name</label>
            <input
              id="modal-name"
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="e.g. Sarah Connor"
              className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
              autoFocus
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
          >
            Join Collaboration
          </button>
        </form>
      </div>
    </div>
  );
}

export default function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const resolvedParams = use(params);
  
  return (
    <RoomProvider room={resolvedParams.roomId}>
      <div className="flex flex-col h-screen w-full bg-white overflow-hidden text-slate-900 font-sans selection:bg-blue-100">
        <TopBar roomId={resolvedParams.roomId} />
        <div className="flex flex-1 overflow-hidden">
          <ActiveUsers />
          <main className="flex-1 relative flex flex-col bg-white">
            <Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate-500 font-medium italic animate-pulse">Loading Editor...</div>}>
              <Editor />
              <NamePromptModal />
            </Suspense>
          </main>
          <AIPanel />
        </div>
      </div>
    </RoomProvider>
  );
}
