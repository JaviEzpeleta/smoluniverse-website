import { postErrorToDiscord, postToDiscord } from "@/lib/discord";
import {
  findUserByHandle,
  getIRLTweets,
  saveIRLTweets,
  saveNewUser,
} from "@/lib/postgres";
import { getTwitterUserInfo } from "@/lib/socialData";
import { NextResponse } from "next/server";
import { getTweetsFromUser } from "@/lib/socialData";
import { FetchedTweet } from "@/lib/types";

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
        console.log(" 💚 Twitter user not found", handle);
        return NextResponse.json({
          success: false,
          error: "Twitter user not found",
        });
      }

      // * coming soon:

      // ! getTweetsFromUser

      console.log("💙  getting tweets from user", handle);

      const savedTweets = await getIRLTweets({ handle });

      if (savedTweets && savedTweets.length > 0) {
        await postToDiscord("💚 tweets found for " + handle);
        console.log("💚 tweets found", savedTweets);
        return NextResponse.json({
          success: true,
          profile: profile,
        });
      }

      const tweets = await getTweetsFromUser(handle);

      if (!tweets) {
        console.log("💚 tweets not found", handle);
        return NextResponse.json({
          success: false,
          error: "Tweets not found",
        });
      }

      await saveIRLTweets({ handle, tweets: tweets.allTweets });

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
