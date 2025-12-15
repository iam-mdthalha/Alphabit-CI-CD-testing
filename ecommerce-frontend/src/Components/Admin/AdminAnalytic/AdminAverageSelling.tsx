import React from 'react';

interface AdminSellingProps {
  totalSalesAmount: number;
  totalBooksSold: number;
  growthPercentage?: number;
}

const AdminAvgSelling: React.FC<AdminSellingProps> = ({ totalSalesAmount, totalBooksSold, growthPercentage = 0 }) => {
  const avgSellingPrice = totalBooksSold > 0 ? (totalSalesAmount / totalBooksSold).toFixed(2) : "0";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="text-sm text-gray-600 mb-2">Average Selling Price</div>
      <div className="text-3xl font-bold mb-1">
        ${avgSellingPrice}{" "}
        <span className={`text-sm ${growthPercentage >= 0 ? "text-green-500" : "text-red-500"}`}>
          {growthPercentage >= 0 ? `+${growthPercentage}%` : `-${Math.abs(growthPercentage)}%`}
        </span>
      </div>
      <div className="text-xs text-gray-500">Compared to last month</div>
    </div>
  );
}

export default AdminAvgSelling;
