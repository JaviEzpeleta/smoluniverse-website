import { createNFT } from "@/lib/nft";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const nft = await createNFT();
    return NextResponse.json({
      success: true,
      nft: nft,
    });
  } catch (error) {
    console.error("🔴 Error in /api/nft/create:", error);
    return NextResponse.json(
      { error: "Failed to get recent tweets" },
      { status: 500 }
    );
  }
}
