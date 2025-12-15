import React, { useState } from "react";
import AdminSales from "Components/Admin/AdminAnalytic/AdminSales";
import AdminOrder from "Components/Admin/AdminAnalytic/AdminOrder";
import AdminAvgSelling from "Components/Admin/AdminAnalytic/AdminAverageSelling";
import AdminRevenue from "Components/Admin/AdminAnalytic/AdminRevenue";
import AdminSalesDensity, { StoreData } from "Components/Admin/AdminAnalytic/AdminSalesDensity";
import AdminGross from "Components/Admin/AdminAnalytic/AdminGross";
import AdminBestSelling from "Components/Admin/AdminAnalytic/AdminBestSelling";
import AdminCustRent from "Components/Admin/AdminAnalytic/AdminCustRent";
import AdminSalesGrowth from "Components/Admin/AdminAnalytic/AdminSalesGrowth";
import AdminOperationExpenses from "Components/Admin/AdminAnalytic/AdminOperationExpenses";
import AdminAvgSalesEmployee from "Components/Admin/AdminAnalytic/AdminAvgSalesEmployee";
import AdminUnitsSold from "Components/Admin/AdminAnalytic/AdminUnitsSold";

const AdminAnalytic: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<"Week" | "Month" | "Year">("Month");

  const salesDensityData: StoreData[] = [
    { store: "Store A", totalSales: 500000, storeArea: 2500 },
    { store: "Store B", totalSales: 300000, storeArea: 2000 },
    { store: "Store C", totalSales: 700000, storeArea: 3500 },
    { store: "Store D", totalSales: 150000, storeArea: 1000 },
  ];

  const retentionData = [
    { month: "Jan", new: 85, retained: 40 },
    { month: "Feb", new: 90, retained: 45 },
    { month: "Mar", new: 75, retained: 50 },
    { month: "Apr", new: 65, retained: 85 },
    { month: "May", new: 70, retained: 55 },
    { month: "Jun", new: 60, retained: 65 },
    { month: "Jul", new: 55, retained: 70 },
    { month: "Aug", new: 60, retained: 75 },
  ];

  const salesOverviewData = [
    { month: "Jan", sales: 4000, revenue: 2400 },
    { month: "Feb", sales: 3000, revenue: 1398 },
    { month: "Mar", sales: 2000, revenue: 9800 },
    { month: "Apr", sales: 2780, revenue: 3908 },
    { month: "May", sales: 1890, revenue: 4800 },
    { month: "Jun", sales: 2390, revenue: 3800 },
  ];

  const stats = {
    Week: { totalBooksSold: 120, totalBills: 8, totalSalesAmount: 6000, totalRevenuePrice: 499, totalRevenueQuantity: 120, growthPercentage: 12 },
    Month: { totalBooksSold: 480, totalBills: 24, totalSalesAmount: 24000, totalRevenuePrice: 499, totalRevenueQuantity: 480, growthPercentage: 24 },
    Year: { totalBooksSold: 5760, totalBills: 288, totalSalesAmount: 288000, totalRevenuePrice: 499, totalRevenueQuantity: 5760, growthPercentage: 48 },
  };

  const currentStats = stats[selectedPeriod];

  return (
    <div className="min-h-screen space-y-6 p-4">
        
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminSales
          totalBooksSold={currentStats.totalBooksSold}
          totalBills={currentStats.totalBills}
          growthPercentage={currentStats.growthPercentage}
        />
        <AdminOrder
          totalSalesAmount={currentStats.totalSalesAmount}
          totalBills={currentStats.totalBills}
          growthPercentage={currentStats.growthPercentage}
        />
        <AdminAvgSelling
          totalSalesAmount={currentStats.totalSalesAmount}
          totalBooksSold={currentStats.totalBooksSold}
          growthPercentage={currentStats.growthPercentage}
        />
        <AdminRevenue
          price={currentStats.totalRevenuePrice}
          quantitySold={currentStats.totalRevenueQuantity}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <AdminSalesGrowth />
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <AdminBestSelling />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm">
          <AdminGross netIncome={92000} totalRevenue={240000} />
        </div>
        <div className="lg:col-span-3 bg-white p-4 rounded-xl shadow-sm">
          <AdminSalesDensity data={salesDensityData} />
        </div>
      </div>

      <div>
        <AdminCustRent data={retentionData} />
      </div>
    <div>
      <AdminUnitsSold></AdminUnitsSold>
    </div>
<div className="flex flex-col lg:flex-row gap-6 w-full">
  <div className="flex-1">
    <AdminOperationExpenses />
  </div>
  <div className="flex-1">
    <AdminAvgSalesEmployee />
  </div>
</div>

    </div>
  );
};

export default AdminAnalytic;
