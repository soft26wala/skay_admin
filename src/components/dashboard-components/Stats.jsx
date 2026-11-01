import React, { useEffect, useState } from "react";
import { formatNumber } from "../../lib/helper";
import { useSelector } from "react-redux";
import { DollarSign, Users, Award, TrendingUp, TrendingDown, Sparkles } from "lucide-react";

const Stats = () => {
  const [revenueChange, setRevenueChange] = useState("");
  const [isPositive, setIsPositive] = useState(true);

  const {
    totalUsersCount,
    todayRevenue,
    yesterdayRevenue,
    totalRevenueAllTime,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    let change =
      yesterdayRevenue === 0
        ? 100
        : ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
    setIsPositive(change >= 0);
    const revenueChangeText = `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
    setRevenueChange(revenueChangeText);
  }, [yesterdayRevenue, todayRevenue]);

  const cards = [
    {
      title: "Today's Revenue",
      subtitle: "Daily Botanical Sales",
      value: `$${formatNumber(todayRevenue)}`,
      currency: "CAD",
      change: revenueChange,
      isPositive: isPositive,
      icon: <DollarSign className="w-6 h-6 text-amber-300" />,
      glowColor: "from-amber-500/20 via-amber-500/5 to-transparent",
      borderColor: "border-amber-500/30 hover:border-amber-400/50",
      accent: "text-gold-gradient",
    },
    {
      title: "Registered Patrons",
      subtitle: "Verified VIP Client Base",
      value: (totalUsersCount || 0).toLocaleString(),
      currency: "Clients",
      change: "+Active",
      isPositive: true,
      icon: <Users className="w-6 h-6 text-emerald-400" />,
      glowColor: "from-emerald-500/20 via-emerald-500/5 to-transparent",
      borderColor: "border-emerald-500/25 hover:border-emerald-400/40",
      accent: "text-emerald-300",
    },
    {
      title: "All-Time Revenue",
      subtitle: "Cumulative GMV Volume",
      value: `$${formatNumber(totalRevenueAllTime)}`,
      currency: "CAD",
      change: "Lifetime",
      isPositive: true,
      icon: <Award className="w-6 h-6 text-amber-300" />,
      glowColor: "from-amber-400/25 via-amber-500/10 to-transparent",
      borderColor: "border-amber-400/40 hover:border-amber-300/60 shadow-luxury-glow",
      accent: "text-gold-gradient",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#131926] to-[#0C101A] p-6 border ${card.borderColor} shadow-card-luxury transition-all duration-300 hover:-translate-y-0.5 group`}
        >
          {/* Ambient Glow */}
          <div
            className={`absolute -top-16 -right-16 w-36 h-36 bg-gradient-to-br ${card.glowColor} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition duration-500`}
          />

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 block">
                  {card.title}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">{card.subtitle}</span>
              </div>

              <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shadow-inner">
                {card.icon}
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-end justify-between">
              <div>
                <div className={`font-serif-luxury text-3xl font-extrabold tracking-tight ${card.accent}`}>
                  {card.value}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                  Currency: {card.currency}
                </span>
              </div>

              {card.change && (
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                    card.isPositive
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}
                >
                  {card.isPositive ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  <span>{card.change}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;

