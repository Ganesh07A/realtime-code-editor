"use client";

import { RoomProvider, useRoom } from "@/components/room-provider";

function RoomStatus() {
  const { connected } = useRoom();

  return (
    <div className="p-4 border rounded-lg bg-gray-50 mb-4 text-black">
      <h2 className="font-bold mb-2">Connection Status</h2>
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span>{connected ? "Connected to PartyKit" : "Disconnected"}</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Realtime Editor Preview</h1>
      
      {/* We wrap the components that need real-time data in the RoomProvider */}
      <RoomProvider room="test-room">
        <RoomStatus />
        
        <div className="p-8 border rounded-xl bg-white shadow-sm text-black">
          <p className="text-gray-600 mb-4">
            The Yjs document is now connected to the PartyKit server in room <strong>test-room</strong>. 
          </p>
          <p className="text-sm text-gray-500">
            Open multiple browser tabs to this page and check the connection status. Both should connect to the same WebSocket room. Once you add an editor like Monaco or CodeMirror, you can bind it to the Yjs doc provided by `useRoom()`.
          </p>
        </div>
      </RoomProvider>
    </main>
  );
}