import { NextRequest,NextResponse } from "next/server"; 

export async function GET(req: NextRequest , { params }: {params: {roomId: Promise<string>}}) {


    const roomId = await params.roomId;
    return NextResponse.json({
        id: roomId,
        language: "typescript",
        exists: true
    }) 
}           