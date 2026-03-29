"use client";

import { useMemo } from "react";
import DataTable from "@/components/DataTable";
import { formatCurrency } from "@/lib/utils";

interface Props {
  tickers: Ticker[];
}

interface TradeRow {
  price: number;
  amount: number;
  value: number;
  type: "buy" | "sell";
  time: string;
}

const getTradeType = (id: string, timestamp: string): "buy" | "sell" => {
  const seed = id + timestamp;

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  return hash % 2 === 0 ? "buy" : "sell";
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};

const RecentTrades = ({ tickers = [] }: Props) => {
  const trades = useMemo<TradeRow[]>(() => {
    return tickers.slice(0, 7).map((t) => {
      const price = t.converted_last.usd;

      const amount = 1;

      const value = price * amount;

      return {
        price,
        amount,
        value,
        type: getTradeType(t.base + t.target, t.timestamp),
        time: t.timestamp,
      };
    });
  }, [tickers]);

  const columns: DataTableColumn<TradeRow>[] = [
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
