import { executeIndividualAction } from "@/lib/chaos-factory";
import { postErrorToDiscord } from "@/lib/discord";
import { findUserByHandle, readIRLTweets } from "@/lib/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { handle, code } = await request.json();

    const user = await findUserByHandle(handle);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not found",
      });
    }

    const tweets = await readIRLTweets({ handle });

    await executeIndividualAction({ user, action_type: code, tweets });
    return NextResponse.json({
      success: true,
      message: "Action executed successfully",
    });
  } catch (error) {
    await postErrorToDiscord("🔴 Error in /api/execute-from-playground");
    console.error("🔴 Error in /api/execute-from-playground:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
