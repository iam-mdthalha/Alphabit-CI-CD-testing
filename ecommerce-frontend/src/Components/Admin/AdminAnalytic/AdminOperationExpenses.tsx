"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminOperationExpenses: React.FC = () => {
  // Sample data (replace with real data if needed)
  const data = [
    { month: "Jan", expenses: 2000, revenue: 8000 },
    { month: "Feb", expenses: 1500, revenue: 7500 },
    { month: "Mar", expenses: 10000, revenue: 12000 },
    { month: "Apr", expenses: 4000, revenue: 9000 },
    { month: "May", expenses: 4800, revenue: 9500 },
  ];

  const expenseData = data.map((item) => ({
    month: item.month,
    oer: ((item.expenses / item.revenue) * 100).toFixed(2),
  }));

  return (
    <div className="p-4 rounded-2xl shadow-md bg-white dark:bg-neutral-900 w-full h-full">
      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
        Operating Expense Ratio (%)
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={expenseData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorOER" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fill: "#6b7280" }} tickLine={false} />
          <YAxis
            tickFormatter={(val) => `${val}%`}
            tick={{ fill: "#6b7280" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
            formatter={(value) => [`${value}%`, "OER"]}
          />
          <Area
            type="monotone"
            dataKey="oer"
            stroke="#4f46e5"
            fillOpacity={1}
            fill="url(#colorOER)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminOperationExpenses;
