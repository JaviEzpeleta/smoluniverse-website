import { postErrorToDiscord } from "@/lib/discord";
import { getRecentClones } from "@/lib/postgres";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const users = await getRecentClones();
    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    await postErrorToDiscord("🔴 Error in /api/users/get");
    console.error("🔴 Error in /api/users/get:", error);
    return NextResponse.json({ error: "Failed to get users" }, { status: 500 });
  }
}
