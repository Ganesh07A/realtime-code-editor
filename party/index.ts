
// This is your entire "backend" for real-time sync


import type * as Party from "partykit/server";
import { onConnect } from "y-partykit";

export default class EditorParty implements Party.Server {
  constructor(readonly room: Party.Room) {}

  // Called when a new WebSocket connection comes in
  onConnect(conn: Party.Connection) {
    return onConnect(conn, this.room, {
      persist: true, // Save document state between sessions
      callback: {
        // Called whenever the document changes
        // Use this to trigger AI review
        handler: async (_yDoc) => {
          // Document updated — we can hook into this
          console.log(`[Party] Document updated in room: ${this.room.id}`);
        },
      },
    });
  }

  // Called when a WebSocket message comes in (non-Yjs messages)
  onMessage(message: string, sender: Party.Connection) {
    // We can use this channel for custom messages
    // like broadcasting AI reviews to all users
    const parsed = JSON.parse(message);

    if (parsed.type === "ai-review") {
      // Broadcast AI review to all clients in this room
      this.room.broadcast(message, [sender.id]);
    }
  }
}
