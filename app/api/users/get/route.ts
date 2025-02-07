import { postErrorToDiscord } from "@/lib/discord";
import { getRecentClones } from "@/lib/postgres";
import { getBalanceByHandleCached } from "@/lib/web3functions";
import { ethers } from "ethers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const users = await getRecentClones();
    for (const user of users) {
      const balance = await getBalanceByHandleCached(user.handle);
      const balanceInEth = ethers.formatEther(balance);
      // console.log(" 💚 💚 💚 💚 💚 💚 💚 BALANCE: ", balanceInEth, user.handle);

      user.balance = balanceInEth;
    }
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
