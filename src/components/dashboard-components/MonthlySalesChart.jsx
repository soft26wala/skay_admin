import { useSelector } from "react-redux";
import {
  XAxis,
  YAxis,
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getLastNMonths, formatNumber } from "../../lib/helper";
import { TrendingUp } from "lucide-react";

const MonthlySalesChart = () => {
  const { monthlySales } = useSelector((state) => state.admin);
  const months = getLastNMonths(4).map((m) => m.month);
  const filled = months.map((m) => {
    const found = monthlySales?.find((item) => item.month === m);
    return { month: m, totalSales: found?.totalsales || 0 };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0F1420]/95 backdrop-blur-md p-3 rounded-xl border border-emerald-500/30 shadow-xl text-xs">
          <p className="text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
          <p className="text-emerald-400 font-bold text-sm mt-1">
            ${formatNumber(payload[0].value)} CAD
          </p>
          <span className="text-[10px] text-slate-500">Gross Sales</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-b from-[#131926] to-[#0C101A] p-6 rounded-2xl border border-white/[0.08] shadow-card-luxury flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif-luxury font-bold text-slate-200 text-sm tracking-wide">
            Monthly Botanical Sales
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Recent 4 months velocity</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <TrendingUp className="w-4 h-4" />
        </div>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filled} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="emeraldGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="#64748B" tickLine={false} axisLine={false} />
            <YAxis stroke="#64748B" tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="totalSales"
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#emeraldGlow)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlySalesChart;

