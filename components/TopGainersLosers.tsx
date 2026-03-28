"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/coingecko.actions";
import Image from "next/image";
import { formatCurrency, formatPercentage, cn } from "@/lib/utils";

const TopGainersLosers = () => {
  const [activeTab, setActiveTab] = useState<"gainers" | "losers">("gainers");
  const [gainers, setGainers] = useState<CoinMarketData[]>([]);
  const [losers, setLosers] = useState<CoinMarketData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coins = await fetcher<CoinMarketData[]>("coins/markets", {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 50,
          page: 1,
          price_change_percentage: "24h",
        });

        const sortedGainers = [...coins]
          .sort(
            (a, b) =>
              b.price_change_percentage_24h - a.price_change_percentage_24h,
          )
          .slice(0, 5);

        const sortedLosers = [...coins]
          .sort(
            (a, b) =>
              a.price_change_percentage_24h - b.price_change_percentage_24h,
          )
          .slice(0, 5);

        setGainers(sortedGainers);
        setLosers(sortedLosers);
      } catch (err) {
        console.error("Failed to fetch gainers/losers:", err);
      }
    };

    fetchData();
  }, []);

  const data = activeTab === "gainers" ? gainers : losers;

  return (
    <div id="top-gainers-losers">
      {/* 🔥 Tabs */}
      <div className="tabs-list flex gap-6">
        <button
          onClick={() => setActiveTab("gainers")}
          className={cn(
            "tabs-trigger",
            activeTab === "gainers"
              ? "text-white border-b-2 border-white"
              : "text-gray-500",
          )}
        >
          Top Gainers
        </button>

        <button
          onClick={() => setActiveTab("losers")}
          className={cn(
            "tabs-trigger",
            activeTab === "losers"
              ? "text-white border-b-2 border-white"
              : "text-gray-500",
          )}
        >
          Top Losers
        </button>
      </div>

      {/* 🔥 Content */}
      <div className="tabs-content mt-4 flex flex-col gap-3">
        {data.map((coin) => {
          const isUp = coin.price_change_percentage_24h > 0;

          return (
            <div
              key={coin.id}
              className="flex items-center justify-between p-3 rounded-xl bg-dark-400"
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <Image
                  src={coin.image}
                  alt={coin.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />

                <div>
                  <p className="font-semibold">{coin.name}</p>
                  <p className="text-sm text-gray-400">
                    {coin.symbol.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p className="font-semibold">
                  {formatCurrency(coin.current_price)}
                </p>

                <p
                  className={cn(
                    "text-sm font-medium",
                    isUp ? "text-green-500" : "text-red-500",
                  )}
                >
                  {isUp && "+"}
                  {formatPercentage(coin.price_change_percentage_24h)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopGainersLosers;
