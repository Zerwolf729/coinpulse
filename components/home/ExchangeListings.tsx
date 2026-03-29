"use client";

import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

const ExchangeListings = ({ tickers }: { tickers?: Ticker[] }) => {
  const data = tickers?.slice(0, 6) || [];

  const formatTime = (timestamp: string) => {
    if (!timestamp) return "-";

    const date = new Date(timestamp);

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (data.length === 0) {
    return (
      <div className="exchange-section">
        <h4>Exchange Listings</h4>
        <p className="text-gray-400 mt-3">No data available</p>
      </div>
    );
  }

  return (
    <div className="exchange-section">
      <h4>Exchange Listings</h4>

      <div className="exchange-table">
        <div className="grid grid-cols-4 px-4 py-3 text-gray-400 text-sm border-b border-dark-400">
          <p>Exchange</p>
          <p>Pair</p>
          <p>Price</p>
          <p className="text-right">Last Traded</p>
        </div>

        {data.map((ticker, index) => (
          <div
            key={index}
            className="grid grid-cols-4 px-4 py-3 items-center border-b border-dark-400 last:border-none"
          >
            <div className="relative exchange-name">
              <p>{ticker.market?.name || "-"}</p>
              {ticker.trade_url && (
                <Link
                  href={ticker.trade_url}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              )}
            </div>

            <p>
              {ticker.base} / {ticker.target}
            </p>

            <p>{formatCurrency(ticker.converted_last?.usd || 0)}</p>

            <p className="text-right text-gray-400">
              {formatTime(ticker.timestamp)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExchangeListings;
