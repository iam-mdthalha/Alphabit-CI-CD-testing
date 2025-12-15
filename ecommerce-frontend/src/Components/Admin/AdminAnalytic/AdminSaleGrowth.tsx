"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";

const profitMarginData = [
  { month: "Jan", production: 4000, selling: 6000 },
  { month: "Feb", production: 4200, selling: 6400 },
  { month: "Mar", production: 4500, selling: 7000 },
  { month: "Apr", production: 4600, selling: 7200 },
  { month: "May", production: 5000, selling: 7800 },
  { month: "Jun", production: 5300, selling: 8000 },
  { month: "Jul", production: 5600, selling: 8500 },
];

const AdminSaleGrowth: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Profit Margin Chart
        </h2>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </div>

      {/* Chart */}
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={profitMarginData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                border: "1px solid #f3f4f6",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="production"
              stroke="#4ade80"
              strokeWidth={2.5}
              dot={{ r: 4 }}
              name="Production Cost"
            />
            <Line
              type="monotone"
              dataKey="selling"
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={{ r: 4 }}
              name="Selling Cost"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminSaleGrowth;
