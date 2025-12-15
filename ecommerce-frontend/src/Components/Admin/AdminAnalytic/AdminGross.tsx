"use client";
import React from "react";
import { Info } from "lucide-react";

interface AdminGrossProps {
  netIncome: number;
  totalRevenue: number;
}

const AdminGross: React.FC<AdminGrossProps> = ({ netIncome, totalRevenue }) => {
  const netProfitMargin =
    totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;

  const percentage = Math.min(Math.max(netProfitMargin, 0), 100);
  const circleRadius = 70;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const progress = (percentage / 100) * circleCircumference;

  return (
    <div className="bg-white  flex flex-col items-center justify-center p-6 w-[280px] mt-10">
      <div className="flex items-center justify-between w-full mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Net Profit Margin
        </h2>
        <Info className="w-5 h-5 text-gray-400" />
      </div>

      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40 mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={circleRadius}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="10"
            />
            <circle
              cx="80"
              cy="80"
              r={circleRadius}
              fill="none"
              stroke="#31C48D"
              strokeWidth="10"
              strokeDasharray={`${progress} ${circleCircumference}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-800">
              {percentage.toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500">Profit Margin</span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="space-y-2 text-gray-700 w-full px-4">
          <div className="flex justify-between">
            <span className="text-sm">Net Income</span>
            <span className="font-semibold">
              ${netIncome.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Total Revenue</span>
            <span className="font-semibold">
              ${totalRevenue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGross;
