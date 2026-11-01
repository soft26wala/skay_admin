import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Sparkles } from "lucide-react";

const TopProductsChart = () => {
  const { topSellingProducts } = useSelector((state) => state.admin);

  const CustomYAxisTick = ({ x, y, payload }) => {
    return (
      <foreignObject x={x - 38} y={y - 18} width={36} height={36}>
        <img
          src={payload.value}
          alt="product"
          className="w-8 h-8 rounded-full object-cover border border-amber-400/50 shadow-sm"
          onError={(e) => {
            e.target.src = "/new/hero/img1.png";
          }}
        />
      </foreignObject>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      const product = payload[0].payload;
      return (
        <div className="bg-[#0F1420]/95 backdrop-blur-md p-3 rounded-xl border border-amber-500/30 shadow-2xl text-xs">
          <p className="font-serif-luxury font-bold text-amber-300 text-sm">{product.name}</p>
          <p className="text-slate-300 mt-1">
            Sold: <span className="font-bold text-white">{product.total_sold} units</span>
          </p>
          <span className="text-[10px] text-slate-500 block mt-0.5">Category: {product.category}</span>
        </div>
      );
    }
    return null;
  };

  const barColors = [
    "url(#goldBarGradient)",
    "url(#emeraldBarGradient)",
    "url(#skyBarGradient)",
  ];

  return (
    <div className="bg-gradient-to-b from-[#131926] to-[#0C101A] p-6 rounded-2xl border border-white/[0.08] shadow-card-luxury flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-serif-luxury font-bold text-slate-200 text-sm tracking-wide">
            Top 3 Formulations
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Highest volume apothecary elixirs</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <div className="h-52 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={topSellingProducts?.slice(0, 3) || []}
            margin={{ top: 10, right: 10, bottom: 0, left: 20 }}
            barSize={24}
          >
            <defs>
              <linearGradient id="goldBarGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#9B7D1A" />
                <stop offset="100%" stopColor="#D4AF37" />
              </linearGradient>
              <linearGradient id="emeraldBarGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#047857" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
              <linearGradient id="skyBarGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0369A1" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
            </defs>
            <XAxis type="number" stroke="#64748B" tickLine={false} axisLine={false} />
            <YAxis
              dataKey="image"
              type="category"
              tick={<CustomYAxisTick />}
              width={40}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total_sold" radius={[0, 8, 8, 0]}>
              {(topSellingProducts?.slice(0, 3) || []).map((_, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopProductsChart;

