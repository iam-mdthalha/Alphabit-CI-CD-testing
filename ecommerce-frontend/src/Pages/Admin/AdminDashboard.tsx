"use client";
import { OrdersOverTimeChart } from "Components/Admin/AdminDashboard/OrdersOverTimeChart";
import { LastSevenDaysSalesChart } from "Components/Admin/AdminDashboard/LastSevenDaysSalesChart";
import { RecentTransactionsTable } from "Components/Admin/AdminDashboard/RecentTransactionsTable";
import { TopProductsTable } from "Components/Admin/AdminDashboard/TopProductsTable";
import { MetricsCards } from "Components/Admin/AdminDashboard/MetricsCards";
import SalesCountByOrderStatusChart from "Components/Admin/AdminDashboard/SalesCountByOrderStatusChart";
import SalesValueByOrderStatusChart from "Components/Admin/AdminDashboard/SalesValueByOrderStatusChart";

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto font-gilroyRegular">
      <>
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        </header>

        <MetricsCards />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <OrdersOverTimeChart />
          <LastSevenDaysSalesChart />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentTransactionsTable />
          <TopProductsTable />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <SalesCountByOrderStatusChart />
          <SalesValueByOrderStatusChart />
        </div>
      </>
    </div>
  );
};

export default AdminDashboard;
