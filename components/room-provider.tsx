"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import YPartyKitProvider from "y-partykit/provider";
import * as Y from "yjs";

// Create context for Yjs Document and Provider
type RoomContextType = {
  doc: Y.Doc | null;
  provider: YPartyKitProvider | null;
  connected: boolean;
};

const RoomContext = createContext<RoomContextType>({
  doc: null,
  provider: null,
  connected: false,
});

export const useRoom = () => useContext(RoomContext);

export function RoomProvider({
  room,
  children,
}: {
  room: string;
  children: ReactNode;
}) {
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<YPartyKitProvider | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // 1. Initialize a new Yjs document
    const yDoc = new Y.Doc();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDoc(yDoc);

    // 2. Connect it to the PartyKit room
    // By default PartyKit runs on port 1999 locally
    const host = process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999";
    
    const yProvider = new YPartyKitProvider(host, room, yDoc, {
      connect: false, // We will connect manually
    });

    setProvider(yProvider);
    yProvider.connect();

    // Listen to connection status
    yProvider.on("status", ({ status }: { status: "connecting" | "connected" | "disconnected" }) => {
      setConnected(status === "connected");
    });

    // Cleanup when component unmounts
    return () => {
      yProvider.disconnect();
      yDoc.destroy();
      setDoc(null);
      setProvider(null);
    };
  }, [room]);

  return (
    <RoomContext.Provider value={{ doc, provider, connected }}>
      {children}
    </RoomContext.Provider>
  );
}
