import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";

const CoinHeader = ({
  livePriceChangePercentage24h,
  priceChangePercentage30d,
  name,
  image,
  livePrice,
  priceChange24h,
}: LiveCoinHeaderProps) => {
  const safePrice = livePrice ?? 0;
  const safeChange24h = livePriceChangePercentage24h ?? 0;
  const safe30d = priceChangePercentage30d ?? 0;
  const safePriceChange24h = priceChange24h ?? 0;

  const isTrendingUp = safeChange24h > 0;
  const isThirtyDayUp = safe30d > 0;
  const isPriceChangeUp = safePriceChange24h > 0;

  const stats = [
    {
      label: "Today",
      value: safeChange24h,
      isUp: isTrendingUp,
      formatter: formatPercentage,
      showIcon: true,
    },
    {
      label: "30 Days",
      value: safe30d,
      isUp: isThirtyDayUp,
      formatter: formatPercentage,
      showIcon: true,
    },
    {
      label: "Price Change (24h)",
      value: safePriceChange24h,
      isUp: isPriceChangeUp,
      formatter: formatCurrency,
      showIcon: false,
    },
  ];

  return (
    <div id="coin-header">
      <h3>{name}</h3>

      <div className="info">
        <Image src={image} alt={name} width={77} height={77} />

        <div className="price-row">
          <h1>{formatCurrency(safePrice)}</h1>

          <Badge
            className={cn("badge", isTrendingUp ? "badge-up" : "badge-down")}
          >
            {formatPercentage(safeChange24h)}
            {isTrendingUp ? <TrendingUp /> : <TrendingDown />}
            (24h)
          </Badge>
        </div>
      </div>

      <ul className="stats">
        {stats.map((stat) => (
          <li key={stat.label}>
            <p className="label">{stat.label}</p>

            <div
              className={cn("value", {
                "text-green-500": stat.isUp,
                "text-red-500": !stat.isUp,
              })}
            >
              <p>{stat.formatter(stat.value)}</p>

              {stat.showIcon &&
                (stat.isUp ? (
                  <TrendingUp width={16} height={16} />
                ) : (
                  <TrendingDown width={16} height={16} />
                ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoinHeader;
