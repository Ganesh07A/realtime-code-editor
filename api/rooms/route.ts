// app/api/rooms/route.ts
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import type { Room, SupportedLanguage } from "@/lib/types";

// In a real production app, this would be a database (Vercel KV, Postgres, etc.)
// For the hackathon, in-memory is fine for a single serverless instance
// Vercel KV is a one-line addition if needed
const rooms = new Map<string, Room>();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const language: SupportedLanguage = body.language ?? "typescript";

  const room: Room = {
    id: nanoid(8),          // Short, shareable ID like "aB3xK9mQ"
    language,
    createdAt: Date.now(),
    createdBy: body.username ?? "anonymous",
  };

  rooms.set(room.id, room);

  return NextResponse.json({
    room,
    shareUrl: `${req.headers.get("origin")}/room/${room.id}`,
  });
}

export async function GET() {
  // Return all active rooms (useful for debugging)
  return NextResponse.json({
    rooms: Array.from(rooms.values()),
    count: rooms.size,
  });
}