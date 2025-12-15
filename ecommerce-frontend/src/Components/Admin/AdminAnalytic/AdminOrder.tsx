import React from 'react'

interface AdminOrderProps {
  totalSalesAmount: number;
  totalBills: number;
  growthPercentage?: number; 
}

const AdminOrder: React.FC<AdminOrderProps> = ({ totalSalesAmount, totalBills, growthPercentage = 0 }) => {
  const avgOrderValue = totalBills > 0 ? (totalSalesAmount / totalBills).toFixed(2) : "0";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="text-sm text-gray-600 mb-2">Average Order Value</div>
      <div className="text-3xl font-bold mb-1">
        ${avgOrderValue}{" "}
        <span className={`text-sm ${growthPercentage >= 0 ? "text-green-500" : "text-red-500"}`}>
          {growthPercentage >= 0 ? `↑ ${growthPercentage}%` : `↓ ${Math.abs(growthPercentage)}%`}
        </span>
      </div>
      <div className="text-xs text-gray-500">Compared to last month</div>
    </div>
  );
}

export default AdminOrder;
