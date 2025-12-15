"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BookData {
  book: string;
  sold: number;
  [key: string]: string | number;
}

const bestSellingData: BookData[] = [
  { book: "Book A", sold: 120 },
  { book: "Book B", sold: 98 },
  { book: "Book C", sold: 86 },
  { book: "Book D", sold: 75 },
];

const COLORS = ["#10b981", "#6366f1", "#f59e0b", "#f43f5e"];

// ✅ Custom label renderer inside the slices
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight="500"
    >
      {`${bestSellingData[index].book}`}
    </text>
  );
};

const AdminBestSelling: React.FC = () => {
  return (
    <div className="p-5 flex flex-col items-center w-full max-w-sm mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Best Selling Books
      </h2>
      <div className="w-64 h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={bestSellingData}
              dataKey="sold"
              nameKey="book"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {bestSellingData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Section */}
      <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
        {bestSellingData.map((entry, index) => (
          <div key={entry.book} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: COLORS[index] }}
            ></span>
            <span className="text-gray-700">{entry.book}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBestSelling;
