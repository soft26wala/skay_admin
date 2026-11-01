import Header from "./Header";
import MiniSummary from "./dashboard-components/MiniSummary";
import TopSellingProducts from "./dashboard-components/TopSellingProducts";
import Stats from "./dashboard-components/Stats";
import MonthlySalesChart from "./dashboard-components/MonthlySalesChart";
import OrdersChart from "./dashboard-components/OrdersChart";
import TopProductsChart from "./dashboard-components/TopProductsChart";

const Dashboard = () => {
  return (
    <main className="p-4 pl-4 md:pl-[20rem] pr-4 md:pr-6 py-5 w-full min-h-screen text-slate-100">
      <div className="flex-1 max-w-7xl mx-auto space-y-6">
        <Header />

        {/* 1. Executive Top KPI Stats */}
        <Stats />

        {/* 2. Visual Performance Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <MonthlySalesChart />
          <OrdersChart />
          <TopProductsChart />
        </div>

        {/* 3. Detailed Leaderboard & Summary */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <TopSellingProducts />
          <MiniSummary />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;

