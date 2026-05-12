import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ roomId: string }> }) {
  const resolvedParams = await params;
  const roomId = resolvedParams.roomId;

  // In our stateless PartyKit architecture, we don't track rooms locally.
  // When a user connects to a PartyKit room ID, the room is created dynamically.
  // Therefore, from the Next.js API perspective, any room technically "exists"
  // as soon as a client tries to connect to it.
  return NextResponse.json({
    id: roomId,
    // The actual language will be negotiated and synced via the Yjs document in PartyKit
    language: "typescript",
    exists: true
  });
}