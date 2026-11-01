import { useSelector } from "react-redux";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ShoppingBag } from "lucide-react";

const OrdersChart = () => {
  const { orderStatusCounts } = useSelector((state) => state.admin);

  const statusColors = {
    Processing: "#F59E0B",
    Shipped: "#38BDF8",
    Delivered: "#10B981",
    Cancelled: "#F43F5E",
  };

  const orderStatusData = Object.keys(orderStatusCounts || {}).map((status) => ({
    status,
    count: parseInt(orderStatusCounts[status], 10) || 0,
  }));

  const totalOrders = orderStatusData.reduce((acc, curr) => acc + curr.count, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-[#0F1420]/95 backdrop-blur-md p-3 rounded-xl border border-white/[0.1] shadow-xl text-xs">
          <p className="text-slate-400 font-semibold">{data.name}</p>
          <p className="text-amber-300 font-bold text-sm mt-0.5">
            {data.value} Orders
          </p>
          <span className="text-[10px] text-slate-500">
            {totalOrders > 0 ? ((data.value / totalOrders) * 100).toFixed(1) : 0}% of Total
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-b from-[#131926] to-[#0C101A] p-6 rounded-2xl border border-white/[0.08] shadow-card-luxury flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-serif-luxury font-bold text-slate-200 text-sm tracking-wide">
            Order Status Allocation
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Consignment pipeline breakdown</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300">
          <ShoppingBag className="w-4 h-4" />
        </div>
      </div>

      <div className="relative h-44 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={orderStatusData}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={72}
              paddingAngle={4}
              stroke="none"
            >
              {orderStatusData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={statusColors[entry.status] || "#94A3B8"}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Count */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-serif-luxury text-xl font-bold text-slate-100">{totalOrders}</span>
          <span className="text-[9px] uppercase tracking-widest text-slate-400">Total</span>
        </div>
      </div>

      {/* Luxury Legend */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06] text-xs">
        {orderStatusData.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between px-2 py-1 rounded-lg bg-white/[0.02]">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: statusColors[entry.status] || "#94A3B8" }}
              />
              <span className="text-slate-400 text-[11px] truncate">{entry.status}</span>
            </div>
            <span className="font-bold text-slate-200 text-[11px]">{entry.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersChart;

