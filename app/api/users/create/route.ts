import { postErrorToDiscord } from "@/lib/discord";
import { findUserByHandle, saveNewUser } from "@/lib/postgres";
import { getTwitterUserInfo } from "@/lib/socialData";
import { NextResponse } from "next/server";
import { getTweetsFromUser } from "@/lib/socialData";

export async function POST(request: Request) {
  try {
    const { handle } = await request.json();

    console.log("  -- - - - - -- - ");
    console.log(" 💚 💚 💚 💚 💚 💚 💚 READY TO BEGIN!!! ", handle);

    const userExists = await findUserByHandle(handle);
    if (userExists) {
      console.log(" 💚 USER EXISTS!!! ", userExists);
      console.log("  -- - - - - -- - ");
      return NextResponse.json({ data: userExists, success: true });
    } else {
      console.log(" 💚 READY TO BEGIN Creating the ClOnE!!! LFG!!!!!!", handle);

      const profile = await getTwitterUserInfo(handle);

      if (!profile) {
        return NextResponse.json({
          success: false,
          error: "Twitter user not found",
        });
      }

      // * coming soon:

      // ! getTweetsFromUser

      // ! crear wallet. save private_key to db.

      // ! transfer funds... and maybe update the db to keep track of the balance? or not? idk..

      // ! saveNewUser

      return NextResponse.json({
        success: true,
        profile: profile,
      });
    }
  } catch (error) {
    await postErrorToDiscord("🔴 Error in /api/users/create");
    console.error("🔴 Error in /api/users/create:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
