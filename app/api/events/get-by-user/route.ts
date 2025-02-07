import { postErrorToDiscord } from "@/lib/discord";
import { getEventsByHandle } from "@/lib/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { handle } = await request.json();
    const recentEvents = await getEventsByHandle(handle);
    console.log("🔴 DEBUG: recentEvents", recentEvents);

    return NextResponse.json({
      success: true,
      events: recentEvents,
    });
  } catch (error) {
    await postErrorToDiscord("🔴 Error in /api/events/get-by-user");
    console.error("🔴 Error in /api/events/get-by-user:", error);
    return NextResponse.json(
      { error: "Failed to get events" },
      { status: 500 }
    );
  }
}
