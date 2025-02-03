export const maxDuration = 60;

import { createNewRandomEvent } from "@/lib/chaos-factory";
import { postErrorToDiscord } from "@/lib/discord";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    await postErrorToDiscord(
      "🔴 Error in /api/events/create: No token provided"
    );
    return NextResponse.json({ error: "No token provided" }, { status: 400 });
  }

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
