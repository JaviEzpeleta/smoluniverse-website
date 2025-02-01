import { postErrorToDiscord } from "@/lib/discord";
import { deleteUserByHandle } from "@/lib/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { handle } = await request.json();
    // await deleteUserByHandle(handle);
    return NextResponse.json({ success: true });
  } catch (error) {
    await postErrorToDiscord("🔴 Error in /api/users/delete");
    console.error("🔴 Error in /api/users/delete:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
