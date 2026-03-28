"use client";

import React, { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import CandlestickChart from "./CandlestickChart";
import CoinHeader from "./CoinHeader";

const LiveDataWrapper = ({
  children,
  coinId,
  poolId,
  coin,
  coinOHLCData,
}: LiveDataProps) => {
  const [livePrice, setLivePrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch(
          `/api/price?coinId=${encodeURIComponent(coinId)}`,
        );

        if (!res.ok) return;

        const data = await res.json();

        const price = data?.[coinId]?.usd;
        if (typeof price === "number") {
          setLivePrice(price);
        }
      } catch (err) {
        console.error("Failed to fetch price:", err);
      }
    };

    fetchPrice();

    const interval = setInterval(fetchPrice, 5000);

    return () => clearInterval(interval);
  }, [coinId]);

  return (
    <section id="live-data-wrapper">
      <CoinHeader
        name={coin.name}
        image={coin.image.large}
        livePrice={livePrice ?? coin.market_data.current_price.usd}
        livePriceChangePercentage24h={
          coin.market_data.price_change_percentage_24h_in_currency.usd
        }
        priceChange24h={coin.market_data.price_change_24h_in_currency.usd}
        priceChangePercentage30d={
          coin.market_data.price_change_percentage_30d_in_currency?.usd ?? 0
        }
      />

      <Separator className="divider" />

      <div className="trend">
        <CandlestickChart coinId={coinId} data={coinOHLCData}>
          <h4>Trend Overview</h4>
        </CandlestickChart>
      </div>

      <Separator className="divider" />

      {children}
    </section>
  );
};

export default LiveDataWrapper;
