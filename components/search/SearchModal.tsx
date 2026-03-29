"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, TrendingDown, X } from "lucide-react";
import { useSearch } from "./SearchProvider";

/* ================= TYPES ================= */

interface Coin {
  id: string;
  name: string;
  symbol: string;
  thumb?: string;
  image?: string;
}

interface MarketData {
  id: string;
  price_change_percentage_24h: number;
}

interface TrendingResponse {
  coins: {
    item: Coin;
  }[];
}

interface SearchResponse {
  coins: Coin[];
}

interface MarketApiResponse {
  id: string;
  price_change_percentage_24h: number | null;
}

/* ================= COMPONENT ================= */

const SearchModal = () => {
  const { open, setOpen } = useSearch();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Coin[]>([]);
  const [trending, setTrending] = useState<Coin[]>([]);
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [loading, setLoading] = useState(false);

  /* ================= HANDLER ================= */

  const handleClose = () => {
    setOpen(false);
    setQuery("");
    setResults([]);
  };

  /* ================= KEYBOARD ================= */

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setOpen]);

  /* ================= TRENDING ================= */

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();

    const fetchTrending = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/search/trending",
          { signal: controller.signal },
        );

        const data: TrendingResponse = await res.json();

        const coins = data.coins.map((c) => c.item);
        setTrending(coins);

        const ids = coins.map((c) => c.id).join(",");
        if (!ids) return;

        const marketRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`,
          { signal: controller.signal },
        );

        const marketJson: MarketApiResponse[] = await marketRes.json();

        const mapped: Record<string, MarketData> = {};
        marketJson.forEach((coin) => {
          mapped[coin.id] = {
            id: coin.id,
            price_change_percentage_24h: coin.price_change_percentage_24h ?? 0,
          };
        });

        setMarketData(mapped);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Trending fetch error:", err);
        }
      }
    };

    fetchTrending();

    return () => controller.abort();
  }, [open]);

  /* ================= SEARCH ================= */

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();

    const fetchSearch = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/search?query=${query}`,
          { signal: controller.signal },
        );

        const data: SearchResponse = await res.json();
        const coins = data.coins.slice(0, 6);

        setResults(coins);

        const ids = coins.map((c) => c.id).join(",");
        if (!ids) return;

        const marketRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`,
          { signal: controller.signal },
        );

        const marketJson: MarketApiResponse[] = await marketRes.json();

        const mapped: Record<string, MarketData> = {};
        marketJson.forEach((coin) => {
          mapped[coin.id] = {
            id: coin.id,
            price_change_percentage_24h: coin.price_change_percentage_24h ?? 0,
          };
        });

        setMarketData(mapped);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Search error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchSearch, 400);

    return () => {
      clearTimeout(delay);
      controller.abort();
    };
  }, [query]);

  /* ================= DERIVED ================= */

  const displayCoins = query ? results : trending;

  /* ================= RENDER ================= */

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="dialog w-full max-w-xl rounded-xl shadow-xl">
        {/* INPUT */}
        <div className="p-4 border-b border-dark-500 relative">
          <input
            autoFocus
            type="text"
            placeholder="Search for a token..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-white pr-10"
          />

          <button
            onClick={() => (query ? setQuery("") : handleClose())}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-100 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* LIST */}
        <div className="overflow-y-auto max-h-96 custom-scrollbar">
          {!query && (
            <p className="px-5 pt-4 text-xs text-purple-100 uppercase">
              Trending Coins
            </p>
          )}

          {loading && (
            <p className="py-6 text-center text-sm text-purple-100">
              Searching...
            </p>
          )}

          {displayCoins.map((coin) => {
            const change =
              marketData[coin.id]?.price_change_percentage_24h ?? 0;

            const isUp = change >= 0;

            return (
              <Link
                key={coin.id}
                href={`/coins/${coin.id}`}
                onClick={handleClose}
                className="px-5 py-3 flex items-center justify-between hover:bg-dark-400/40 transition"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={coin.thumb || coin.image || "/placeholder.png"}
                    alt={coin.name}
                    width={32}
                    height={32}
                  />

                  <div className="flex flex-col">
                    <span className="font-medium text-white">{coin.name}</span>
                    <span className="text-xs text-purple-100 uppercase">
                      {coin.symbol}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-1 ${
                    isUp ? "text-green-400" : "text-red-500"
                  }`}
                >
                  {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span className="text-sm font-medium">
                    {Math.abs(change).toFixed(2)}%
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
