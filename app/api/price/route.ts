import { fetcher } from "@/lib/coingecko.actions";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const coinId = searchParams.get("coinId");

  if (!coinId) {
    return NextResponse.json({ error: "coinId is required" }, { status: 400 });
  }

  try {
    const data = await fetcher<Record<string, { usd: number }>>(
      "simple/price",
      {
        ids: coinId,
        vs_currencies: "usd",
      },
      0,
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("API route error:", error);

    return NextResponse.json(
      { error: "Failed to fetch price" },
      { status: 500 },
    );
  }
}
