"use client";

import { use, useState, useEffect, Suspense } from "react";
import { RoomProvider, useRoom } from "@/components/room-provider";
import { Editor } from "@/components/editor";
import Link from "next/link";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

function NamePromptModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const name = searchParams.get("name");
  
  const [inputName, setInputName] = useState("");
  const isMissingName = !name || name === "Anonymous";

  if (!isMissingName) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("name", inputName.trim());
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-300">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Identify Yourself</h2>
        <p className="text-slate-500 mb-8">Collaborators will see this name next to your cursor.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="modal-name" className="block text-sm font-semibold text-slate-700 mb-2">Display Name</label>
            <input
              id="modal-name"
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="e.g. Alex"
              className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
              autoFocus
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
          >
            Start Collaborating
          </button>
        </form>
      </div>
    </div>
  );
}

function TopBar({ roomId }: { roomId: string }) {
  const { doc: yDoc, connected } = useRoom();
  const [copied, setCopied] = useState(false);
  const [filename, setFilename] = useState("main-app.ts");
  const [language, setLanguage] = useState("javascript");

  useEffect(() => {
    if (!yDoc) return;
    const configMap = yDoc.getMap("config");
    
    const updateConfig = () => {
      setFilename((configMap.get("filename") as string) || "main-app.ts");
      setLanguage((configMap.get("language") as string) || "javascript");
    };

    configMap.observe(updateConfig);
    updateConfig();

    return () => configMap.unobserve(updateConfig);
  }, [yDoc]);

  const handleLanguageChange = (newLang: string) => {
    if (!yDoc) return;
    yDoc.getMap("config").set("language", newLang);
  };

  const handleFilenameChange = (newFile: string) => {
    if (!yDoc) return;
    yDoc.getMap("config").set("filename", newFile);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <header className="h-12 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0 shadow-sm relative z-10">
      <div className="flex items-center gap-4 flex-1">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
          <span className="font-semibold text-sm text-slate-900 hidden md:block">Synthetix</span>
        </Link>
        <div className="w-px h-4 bg-slate-200 hidden md:block"></div>
        
        <div className="flex items-center gap-2 group max-w-[120px] sm:max-w-xs overflow-hidden">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 shrink-0">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <input 
            type="text" 
            value={filename}
            onChange={(e) => handleFilenameChange(e.target.value)}
            className="text-sm text-slate-600 font-medium bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none py-0.5 transition-colors w-full"
            placeholder="filename.ext"
          />
        </div>

        <div className="w-px h-4 bg-slate-200 hidden md:block"></div>

        <select 
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-tight bg-slate-50 border border-slate-200 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
        >
          <option value="javascript">Javascript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium px-2 py-1 bg-slate-50 border border-slate-200 rounded-md whitespace-nowrap">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
          <span className="text-slate-600 hidden sm:block">{connected ? 'Connected' : 'Connecting...'}</span>
        </div>
        <button 
          onClick={handleShare}
          className="h-8 px-2 sm:px-3 text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
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
          <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
        </button>
        <button className="h-8 px-3 sm:px-4 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Run
        </button>
      </div>
    </header>
  );
}

interface UserPresence {
  name: string;
  color: string;
  colorLight?: string;
}

function ActiveUsers() {
  const { provider } = useRoom();
  const [users, setUsers] = useState<UserPresence[]>([]);

  useEffect(() => {
    if (!provider) return;
    
    const updateUsers = () => {
      const states = Array.from(provider.awareness.getStates().values());
      const activeUsers = states
        .filter((s: Record<string, unknown>) => s.user)
        .map((s: Record<string, unknown>) => s.user as UserPresence);
      setUsers(activeUsers);
    };

    provider.awareness.on('change', updateUsers);
    updateUsers();

    return () => {
      provider.awareness.off('change', updateUsers);
    };
  }, [provider]);

  return (
    <div className="w-16 lg:w-56 shrink-0 bg-[#f8f9ff] border-r border-slate-200 flex flex-col items-center lg:items-stretch py-4 overflow-y-auto h-full shadow-2xl lg:shadow-none">
      <div className="px-4 mb-4 hidden lg:block text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
        Collaborators ({users.length})
      </div>
      <div className="flex flex-col gap-2 px-2 lg:px-3 w-full">
        {users.map((user, i) => (
          <div key={`${user.name}-${i}`} className="flex items-center gap-3 p-1.5 lg:p-2.5 rounded-xl hover:bg-white hover:shadow-sm cursor-pointer transition-all group relative" title={user.name}>
            <div 
              className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-white/50"
              style={{ backgroundColor: user.color || '#0058bc' }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="hidden lg:block overflow-hidden flex-1">
              <div className="text-sm font-semibold text-slate-700 truncate">{user.name || 'Anonymous'}</div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Online
              </div>
            </div>
            <div className="lg:hidden absolute left-full ml-2 px-2.5 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none shadow-xl z-50 transform translate-x-1 group-hover:translate-x-0 transition-all">
              {user.name || 'Anonymous'}
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="px-4 py-8 text-center text-xs text-slate-400 hidden lg:block italic">
            Connecting to peers...
          </div>
        )}
      </div>
    </div>
  );
}

function AIPanel() {
  const { doc: yDoc, provider } = useRoom();
  const [review, setReview] = useState<string>("");
  const [isReviewing, setIsReviewing] = useState(false);

  const [isSelectionReview, setIsSelectionReview] = useState(false);

  useEffect(() => {
    if (!yDoc) return;
    const aiMap = yDoc.getMap("ai");
    
    const updateAI = () => {
      setReview((aiMap.get("review") as string) || "");
      setIsReviewing(!!aiMap.get("isReviewing"));
      setIsSelectionReview(!!aiMap.get("isSelection"));
    };

    aiMap.observe(updateAI);
    updateAI();

    return () => aiMap.unobserve(updateAI);
  }, [yDoc]);

  const handleReview = async () => {
    if (!yDoc || isReviewing || !provider) return;
    
    const aiMap = yDoc.getMap("ai");
    const configMap = yDoc.getMap("config");
    const code = yDoc.getText("codemirror").toString();
    const language = (configMap.get("language") as string) || "javascript";
    const filename = (configMap.get("filename") as string) || "main-app.ts";

    // Get selection from awareness
    const selection = (provider.awareness.getLocalState() as { selection?: { text: string; from: number; to: number } })?.selection;
    const selectedText = selection?.text || "";

    aiMap.set("isReviewing", true);
    aiMap.set("review", "");
    aiMap.set("isSelection", !!selectedText);
    aiMap.set("selectionRange", (selection && selectedText) ? { from: selection.from, to: selection.to } : null);

    try {
      const response = await fetch("/api/ai/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, filename, selectedText }),
      });

      const data = await response.json();
      if (data.result) {
        aiMap.set("review", data.result);
      } else {
        aiMap.set("review", "Error: " + (data.error || "Failed to generate review"));
      }
    } catch {
      aiMap.set("review", "Error: Connection failed.");
    } finally {
      aiMap.set("isReviewing", false);
    }
  };

  const handleApplyFix = () => {
    if (!yDoc || !review) return;

    // Extract the code block from the review
    // We look for the last code block in the markdown
    const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/g;
    const matches = Array.from(review.matchAll(codeBlockRegex));
    
    if (matches.length === 0) {
      alert("No code block found in the AI review to apply.");
      return;
    }

    const lastMatch = matches[matches.length - 1];
    const newCode = lastMatch[1].trim();

    const aiMap = yDoc.getMap("ai");
    const isSelection = aiMap.get("isSelection");
    const range = aiMap.get("selectionRange") as { from: number; to: number } | null;
    const yText = yDoc.getText("codemirror");

    yDoc.transact(() => {
      if (isSelection && range) {
        // Surgical replacement
        yText.delete(range.from, range.to - range.from);
        yText.insert(range.from, newCode);
        // Clear selection flag after apply
        aiMap.set("isSelection", false);
        aiMap.set("selectionRange", null);
      } else {
        // Full file replacement
        yText.delete(0, yText.length);
        yText.insert(0, newCode);
      }
      aiMap.set("review", ""); // Clear review after applying
    });
  };

  return (
    <div className="flex flex-col w-72 sm:w-80 shrink-0 bg-[#f8f9ff] border-l border-slate-200 h-full shadow-2xl lg:shadow-none">
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
        {!review && !isReviewing && (
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                  <path d="M12 2a2 2 0 0 1 2 2c0 1.1-.9 2-2 2a2 2 0 0 1-2-2c0-1.1.9-2 2-2Z"></path>
                </svg>
              </div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">Synthetix AI</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              I&apos;m ready to review your code via OpenRouter. Click the &quot;Review Code&quot; button below and I&apos;ll analyze the current document for bugs, performance, and security.
            </p>
          </div>
        )}

        {isReviewing && (
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm animate-pulse flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-medium text-slate-600 italic">AI is analyzing your code...</p>
          </div>
        )}

        {review && (
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-xs font-bold text-slate-800">{isSelectionReview ? 'Snippet Fix' : 'Latest Review'}</span>
              </div>
              <button onClick={() => { if(yDoc) {
                const aiMap = yDoc.getMap("ai");
                aiMap.set("review", "");
                aiMap.set("isSelection", false);
              }}} className="text-[10px] font-bold text-slate-400 hover:text-rose-500 uppercase transition-colors">Clear</button>
            </div>
            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap font-sans text-sm leading-relaxed mb-4">
              {review}
            </div>
            
            <button 
              onClick={handleApplyFix}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-2 rounded-lg transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {isSelectionReview ? 'Apply Snippet Fix' : 'Apply Full Fix'}
            </button>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <button 
          onClick={handleReview}
          disabled={isReviewing}
          className={`w-full text-white text-sm font-semibold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${isReviewing ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-slate-900 hover:bg-slate-800 hover:shadow-slate-500/25'}`}
        >
          {isReviewing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Analyzing...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              Review Code
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const resolvedParams = use(params);
  const [showMobileAI, setShowMobileAI] = useState(false);
  const [showMobileUsers, setShowMobileUsers] = useState(false);
  
  return (
    <RoomProvider room={resolvedParams.roomId}>
      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-white text-slate-400 italic">Synchronizing...</div>}>
        <div className="flex flex-col h-screen w-full bg-white overflow-hidden text-slate-900 font-sans selection:bg-blue-100">
          <TopBar roomId={resolvedParams.roomId} />
          
          {/* Mobile Navigation Toggles */}
          <div className="lg:hidden flex items-center justify-between px-4 py-2 border-b border-slate-100 bg-slate-50/50 shrink-0">
            <button 
              onClick={() => setShowMobileUsers(!showMobileUsers)}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${showMobileUsers ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
              Collaborators
            </button>
            <button 
              onClick={() => setShowMobileAI(!showMobileAI)}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${showMobileAI ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              AI Assistant
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden relative">
            {/* Collaborators List - Sidebar */}
            <div className={`${showMobileUsers ? 'flex' : 'hidden'} lg:flex absolute inset-y-0 left-0 z-40 lg:relative h-full`}>
              <ActiveUsers />
              {showMobileUsers && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm lg:hidden -z-10" onClick={() => setShowMobileUsers(false)}></div>}
            </div>

            <main className="flex-1 relative flex flex-col bg-white">
              <Editor />
            </main>

            {/* AI Assistant - Sidebar */}
            <div className={`${showMobileAI ? 'flex' : 'hidden'} lg:flex absolute inset-y-0 right-0 z-40 lg:relative h-full`}>
              <AIPanel />
              {showMobileAI && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm lg:hidden -z-10" onClick={() => setShowMobileAI(false)}></div>}
            </div>
          </div>
          <NamePromptModal />
        </div>
      </Suspense>
    </RoomProvider>
  );
}
