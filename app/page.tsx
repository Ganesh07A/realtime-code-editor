"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async () => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() || "Anonymous" }),
      });
      if (!response.ok) throw new Error("Failed to create room");
      const { room } = await response.json();
      
      const query = new URLSearchParams({ name: username.trim() || "Anonymous" }).toString();
      router.push(`/room/${room.id}?${query}`);
    } catch (error) {
      console.error(error);
      setIsCreating(false);
    }
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    let finalRoomId = roomId.trim();
    if (!finalRoomId) return;

    try {
      if (finalRoomId.startsWith("http")) {
        const url = new URL(finalRoomId);
        const pathParts = url.pathname.split("/");
        finalRoomId = pathParts[pathParts.length - 1];
      } else if (finalRoomId.includes("/room/")) {
        const parts = finalRoomId.split("/room/");
        finalRoomId = parts[1].split(/[?#]/)[0];
      }
    } catch (_err) {
      // Ignore parse errors
    }

    const query = new URLSearchParams({ name: username.trim() || "Anonymous" }).toString();
    router.push(`/room/${finalRoomId}?${query}`);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">Synthetix</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Pricing</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Docs</a>
        </nav>
        <div>
          <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2">Sign In</button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 pt-24 pb-32 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6">
          Write code together,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">in real-time.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl leading-relaxed">
          The fastest way for teams to collaborate on code without the friction. Professional tools built for your focus.
        </p>

        {/* Central Action Card */}
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
          
          <div className="mb-6">
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2 text-left">Your Name</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., Alex"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <button
            onClick={handleCreateRoom}
            disabled={isCreating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 px-4 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            )}
            <span>{isCreating ? "Creating..." : "Create New Room"}</span>
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-slate-100 flex-1"></div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">or join existing</span>
            <div className="h-px bg-slate-100 flex-1"></div>
          </div>

          <form onSubmit={handleJoinRoom} className="flex gap-2">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
              className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
              required
            />
            <button
              type="submit"
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium py-3 px-5 rounded-xl transition-colors text-sm"
            >
              Join
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 text-center text-slate-500 text-sm">
        <div className="flex justify-center gap-6 mb-4">
          <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
          <a href="#" className="hover:text-slate-900 transition-colors">GitHub</a>
        </div>
        <p>© {new Date().getFullYear()} Synthetix Code. Built for developers.</p>
      </footer>
    </div>
  );
}