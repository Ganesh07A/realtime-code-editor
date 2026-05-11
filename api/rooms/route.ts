// app/api/rooms/route.ts
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import type { Room, SupportedLanguage } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const language: SupportedLanguage = body.language ?? "typescript";

  // We are using PartyKit to handle the actual state and persistence!
  // This route now simply generates a unique ID for the client to use.
  // The client will connect to PartyKit with this ID, and PartyKit will dynamically create the room.
  const room: Room = {
    id: nanoid(8),          // Short, shareable ID like "aB3xK9mQ"
    language,
    createdAt: Date.now(),
    createdBy: body.username ?? "anonymous",
  };

  return NextResponse.json({
    room,
    shareUrl: `${req.headers.get("origin")}/room/${room.id}`,
  });
}

export async function GET() {
  // Since we are using PartyKit statelessly, we don't store rooms in memory here anymore.
  // To get a list of active rooms, you would query the PartyKit REST API.
  return NextResponse.json({
    message: "Rooms are managed dynamically by PartyKit.",
    rooms: [],
    count: 0,
  });
}