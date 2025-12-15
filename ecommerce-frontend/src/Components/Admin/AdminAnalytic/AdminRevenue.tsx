import React from "react";

interface AdminRevenueProps {
  price: number; 
  quantitySold: number; 
}

const AdminRevenue: React.FC<AdminRevenueProps> = ({ price, quantitySold }) => {
  const totalRevenue = price * quantitySold;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-600">Total Revenue</div>
        <div className="text-green-600 font-semibold text-lg">
          ₹{totalRevenue.toLocaleString()}
        </div>
      </div>

      <div className="text-xs text-gray-500">
        Based on {quantitySold.toLocaleString()} items sold at ₹{price} each
      </div>
    </div>
  );
};

export default AdminRevenue;
