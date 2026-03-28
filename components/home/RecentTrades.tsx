"use client";

import { useMemo } from "react";
import DataTable from "@/components/DataTable";
import { formatCurrency } from "@/lib/utils";

interface Props {
  tickers: Ticker[];
}

const RecentTrades = ({ tickers = [] }: Props) => {
  // 🔥 ambil max 7 data biar mirip UI
  const trades = useMemo(() => {
    return tickers.slice(0, 7).map((t) => {
      const price = t.last;
      const amount = t.volume / 1000; // kecilin biar realistis
      const value = price * amount;

      return {
        price,
        amount,
        value,
        type: Math.random() > 0.5 ? "buy" : "sell", // fake buy/sell
        time: t.last_traded_at,
      };
    });
  }, [tickers]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(); // simple & aman (no Date.now ❌)
  };

  const columns: DataTableColumn<any>[] = [
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (trade) => formatCurrency(trade.price),
    },
    {
      header: "Amount",
      cellClassName: "amount-cell",
      cell: (trade) => trade.amount.toFixed(4),
    },
    {
      header: "Value",
      cellClassName: "value-cell",
      cell: (trade) => formatCurrency(trade.value),
    },
    {
      header: "Buy/Sell",
      cellClassName: "type-cell",
      cell: (trade) => (
        <span
          className={trade.type === "buy" ? "text-green-500" : "text-red-500"}
        >
          {trade.type === "buy" ? "Buy" : "Sell"}
        </span>
      ),
    },
    {
      header: "Time",
      cellClassName: "time-cell",
      cell: (trade) => formatTime(trade.time),
    },
  ];

  if (!tickers.length) return null;

  return (
    <div className="trades">
      <h4>Recent Trades</h4>

      <DataTable
        columns={columns}
        data={trades}
        rowKey={(_, index) => index}
        tableClassName="trades-table"
      />
    </div>
  );
};

export default RecentTrades;
