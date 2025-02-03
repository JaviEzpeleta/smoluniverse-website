import { postErrorToDiscord } from "@/lib/discord";
import { getSmolTweetsByHandle } from "@/lib/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { handle } = await request.json();
    const recentSmolTweets = await getSmolTweetsByHandle(handle);
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
