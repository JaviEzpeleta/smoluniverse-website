import { postErrorToDiscord } from "@/lib/discord";
import {
  findUserByHandle,
  getIRLTweets,
  getWalletByHandle,
  saveIRLTweets,
  saveNewUser,
} from "@/lib/postgres";
import { getTwitterUserInfo } from "@/lib/socialData";
import { NextResponse } from "next/server";
import { getTweetsFromUser } from "@/lib/socialData";
import { RawUser } from "@/lib/types";
import {
  createAndSaveNewWallet,
  sendInitialFundsToWallet,
} from "@/lib/web3functions";
import {
  generateUserInitialLifeAdditionalContext,
  generateUserInitialSkillLevels,
  getLifeGoals,
} from "@/lib/prompts";

export async function POST(request: Request) {
  try {
    const { handle } = await request.json();

    // console.log("  -- - - - - -- - ");
    // console.log(" 💚 💚 💚 💚 💚 💚 💚 READY TO BEGIN!!! ", handle);

    const userExists = await findUserByHandle(handle);
    if (userExists) {
      //   console.log(" 💚 USER EXISTS!!! ", userExists);
      //   console.log("  -- - - - - -- - ");
      return NextResponse.json({ data: userExists, success: true });
    } else {
      //   console.log(" 💚 READY TO BEGIN Creating the ClOnE!!! LFG!!!!!!", handle);

      const profile = await getTwitterUserInfo(handle);

      if (!profile) {
        // console.log(" 💚 Twitter user not found", handle);
        return NextResponse.json({
          success: false,
          error: "Twitter user not found",
        });
      }

      // * coming soon:

      // ! getTweetsFromUser

      //   console.log("💙  getting tweets from user", handle);

      const savedTweets = await getIRLTweets({ handle });

      if (savedTweets && savedTweets.length > 0) {
        console.log("✅ TWEETS YA EXISTEN PARA EL USER: ", handle);
      } else {
        const tweets = await getTweetsFromUser(handle);

        if (!tweets) {
          console.log("💚 tweets not found", handle);
          return NextResponse.json({
            success: false,
            error: "Tweets not found",
          });
        }

        await saveIRLTweets({ handle, tweets: tweets.allTweets });
      }

      let wallet = await getWalletByHandle(handle);

      if (!wallet) {
        console.log(" A CREAR WALLET PARA EL USER: ", handle);

        const walletCreated = await createAndSaveNewWallet(handle);

        if (!walletCreated) {
          console.log("🔴 Error in createAndSaveNewWallet", handle);
          return NextResponse.json({
            success: false,
            error: "Error in createAndSaveNewWallet",
          });
        }
        wallet = await getWalletByHandle(handle);
        if (!wallet) {
          console.log("🔴 Error in getWalletByHandle", handle);
          await postErrorToDiscord(
            "🔴 Error (1) generating wallet for the user: " + handle
          );
          return NextResponse.json({
            success: false,
            error: "Error in getWalletByHandle",
          });
        }
        if (!wallet.address) {
          console.log("🔴 Error in wallet.address", handle);
          await postErrorToDiscord(
            "🔴 Error (2) generating wallet for the user: " + handle
          );
          return NextResponse.json({
            success: false,
            error: "Error in wallet.address",
          });
        }
        await sendInitialFundsToWallet(wallet.address);
      } else {
        console.log(" WALLET YA EXISTE PARA EL USER: ", handle);
      }

      // now we get the life goals for the user:

      console.log(
        "�� getting life goals and skill levels for the user",
        handle
      );
      const [lifeGoals, userSkillLevels, userLifeContext] = await Promise.all([
        getLifeGoals(handle),
        generateUserInitialSkillLevels(handle),
        generateUserInitialLifeAdditionalContext(handle, profile),
      ]);

      console.log("userLifeContext:", userLifeContext);

      //   console.log("💚 lifeGoals", lifeGoals);
      //   console.log("💚 userSkillLevels", userSkillLevels);

      const newUser = {
        handle,
        display_name: profile.name,
        profile_picture: profile.profile_image_url_https,
        cover_picture: profile.profile_banner_url,
        twitter_id: profile.id,
        bio: profile.description,
        life_goals: lifeGoals,
        skills: userSkillLevels,
      } as RawUser;

      await saveNewUser(newUser);

      const user = await findUserByHandle(handle);

      //   CREATE TABLE sim_users (
      //     handle TEXT PRIMARY KEY,
      //     display_name TEXT NOT NULL,
      //     profile_picture TEXT,
      //     cover_picture TEXT,
      //     twitter_id TEXT,
      //     bio TEXT,
      //     life_goals TEXT NOT NULL,
      //     skills TEXT NOT NULL,
      //     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      //   );

      // ! saveNewUser
      return NextResponse.json({
        success: true,
        profile: user,
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
