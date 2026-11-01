import React from "react";
import {
  Wallet,
  PackageCheck,
  TrendingUp,
  AlertTriangle,
  BarChart4,
  UserPlus,
} from "lucide-react";
import { useSelector } from "react-redux";
import { formatNumber } from "../../lib/helper";

const MiniSummary = () => {
  const {
    topSellingProducts,
    lowStockProducts,
    revenueGrowth,
    newUsersThisMonth,
    currentMonthSales,
    orderStatusCounts,
  } = useSelector((state) => state.admin);

  const totalOrders = Object.values(orderStatusCounts || {}).reduce(
    (acc, count) => acc + (parseInt(count, 10) || 0),
    0
  );

  const summary = [
    {
      text: "Monthly Botanical Volume",
      subText: `$${formatNumber(currentMonthSales || 0)} CAD gross sales`,
      icon: <Wallet className="w-4 h-4 text-emerald-400" />,
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      text: "Consignments Dispatched",
      subText: `${totalOrders} orders processed in current cycle`,
      icon: <PackageCheck className="w-4 h-4 text-sky-400" />,
      bg: "bg-sky-500/10 border-sky-500/20",
    },
    {
      text: "Signature Best Seller",
      subText: topSellingProducts?.[0]
        ? `${topSellingProducts[0].name} (${topSellingProducts[0].total_sold} flacons)`
        : "Pending sales data",
      icon: <TrendingUp className="w-4 h-4 text-amber-400" />,
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      text: "Apothecary Stock Alert",
      subText: `${lowStockProducts || 0} formulations near reserve threshold`,
      icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
      bg: "bg-rose-500/10 border-rose-500/20",
    },
    {
      text: "Revenue Velocity Trend",
      subText: `Velocity ${
        revenueGrowth?.includes("+") ? "accelerated" : "steady"
      } by ${revenueGrowth || "0%"} vs prior cycle`,
      icon: <BarChart4 className="w-4 h-4 text-purple-400" />,
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      text: "New Atelier Patrons",
      subText: `${newUsersThisMonth || 0} patrons registered this cycle`,
      icon: <UserPlus className="w-4 h-4 text-amber-300" />,
      bg: "bg-amber-400/10 border-amber-400/20",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-[#131926] to-[#0C101A] rounded-2xl p-6 border border-white/[0.08] shadow-card-luxury">
      <h2 className="font-serif-luxury font-bold text-slate-100 text-base tracking-wide">
        Executive Highlights
      </h2>
      <p className="text-xs text-slate-500 mt-0.5 mb-5">
        Real-time telemetry and botanical operational metrics
      </p>

      <div className="space-y-3.5">
        {summary.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3.5 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] transition duration-200"
          >
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${item.bg}`}
            >
              {item.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">{item.text}</p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.subText}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniSummary;

