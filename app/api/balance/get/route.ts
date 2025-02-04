import { postErrorToDiscord } from "@/lib/discord";
import { getBalanceByHandleCached } from "@/lib/web3functions";
import { formatEther } from "ethers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { handle } = await request.json();
    const balance = await getBalanceByHandleCached(handle);
    const balanceInEth = formatEther(balance.toString());
    return NextResponse.json({
      success: true,
      balance: Number(balanceInEth),
    });
  } catch (error) {
    await postErrorToDiscord("🔴 Error in /api/balance/get");
    console.error("🔴 Error in /api/balance/get:", error);
    return NextResponse.json(
      { error: "Failed to get balance" },
      { status: 500 }
    );
  }
}
