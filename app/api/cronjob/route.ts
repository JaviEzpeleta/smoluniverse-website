export const maxDuration = 60;

import { createNewRandomEvent } from "@/lib/chaos-factory";
import { postErrorToDiscord } from "@/lib/discord";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // nothing to do!
  return NextResponse.json({ message: "Nothing to do!" });

  const token = request.nextUrl.searchParams.get("token");

  if (token !== process.env.CRON_SECRET) {
    await postErrorToDiscord("🔴 Error in /api/cronjob: No token provided");
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
