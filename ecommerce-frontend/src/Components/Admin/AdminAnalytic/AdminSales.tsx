import React from 'react'

interface AdminSalesProps {
  totalBooksSold: number;
  totalBills: number;
  growthPercentage?: number; 
}

const AdminSales: React.FC<AdminSalesProps> = ({ totalBooksSold, totalBills, growthPercentage = 0 }) => {
  const avgBooksPerSale = totalBills > 0 ? (totalBooksSold / totalBills).toFixed(2) : "0";

  return (
    <div>
      <div className="bg-green-400 text-white p-6 rounded-2xl shadow-lg w-64 relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-sm font-medium mb-2">Average Books per Sale</div>
          <div className="text-4xl font-bold mb-1">
            {avgBooksPerSale} <span className="text-lg text-red-100">{growthPercentage >= 0 ? `+${growthPercentage}%` : `${growthPercentage}%`}</span>
          </div>
          <div className="text-xs text-red-100">Compared to last month</div>
        </div>
        <div className="absolute bottom-2 right-2 w-24 h-16">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            <polyline
              points="0,40 20,35 40,38 60,25 80,20 100,15"
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AdminSales;
