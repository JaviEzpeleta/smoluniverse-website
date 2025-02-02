import { createNewRandomEvent } from "@/lib/chaos-factory";
import { postErrorToDiscord } from "@/lib/discord";
// import { createEvent } from "@/lib/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const actionResponse = await createNewRandomEvent();

    return NextResponse.json({ actionResponse });
  } catch (error) {
    await postErrorToDiscord("🔴 Error in /api/events/create");
    console.error("🔴 Error in /api/events/create:", error);
    return NextResponse.json(
      { error: "Failed to create new event" },
      { status: 500 }
    );
  }
}
