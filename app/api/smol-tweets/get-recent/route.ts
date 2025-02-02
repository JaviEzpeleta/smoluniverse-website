import { postErrorToDiscord } from "@/lib/discord";
import { getRecentSmolTweets } from "@/lib/postgres";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const recentSmolTweets = await getRecentSmolTweets();
    return NextResponse.json({
      success: true,
      smolTweets: recentSmolTweets,
    });
  } catch (error) {
    await postErrorToDiscord("🔴 Error in /api/smol-tweets/get-recent");
    console.error("🔴 Error in /api/smol-tweets/get-recent:", error);
    return NextResponse.json(
      { error: "Failed to get recent tweets" },
      { status: 500 }
    );
  }
}
