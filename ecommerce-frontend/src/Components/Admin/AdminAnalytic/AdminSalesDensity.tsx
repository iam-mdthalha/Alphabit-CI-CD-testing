import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ShoppingCart, Home, Users } from "lucide-react";

export interface StoreData {
  store: string;
  totalSales: number;
  storeArea: number;
}

interface AdminSalesDensityProps {
  data: StoreData[];
}

const AdminSalesDensity: React.FC<AdminSalesDensityProps> = ({ data }) => {
  const densityData = data.map((d) => ({
    store: d.store,
    density: d.storeArea > 0 ? +(d.totalSales / d.storeArea).toFixed(2) : 0,
  }));

  const totalSales = data.reduce((sum, d) => sum + d.totalSales, 0);
  const totalArea = data.reduce((sum, d) => sum + d.storeArea, 0);
  const avgDensity = totalArea > 0 ? (totalSales / totalArea).toFixed(2) : "0";

  return (
    <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Sales Density Overview</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-xl shadow-sm p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              layout="vertical"
              data={densityData}
              margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#999" />
              <YAxis dataKey="store" type="category" stroke="#999" width={100} />
              <Tooltip formatter={(value: number) => [`$${value}`, "Sales Density"]} />
              <Bar
                dataKey="density"
                fill="#31C48D"
                radius={[4, 4, 4, 4]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

       <div className="w-full lg:w-80 flex flex-col gap-4">
      
      <div className="flex items-center p-4 bg-white rounded-xl shadow border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <div className="p-3 bg-green-100 rounded-full">
          <ShoppingCart className="h-6 w-6 text-green-600" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm text-gray-500">Total Sales</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">
            ${totalSales.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center p-4 bg-white rounded-xl shadow border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <div className="p-3 bg-blue-100 rounded-full">
          <Home className="h-6 w-6 text-blue-600" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm text-gray-500">Total Store Area</h3>
          <p className="text-lg font-semibold text-blue-600 mt-1">
            {totalArea.toLocaleString()} sq.ft
          </p>
        </div>
      </div>

      <div className="flex items-center p-4 bg-white rounded-xl shadow border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <div className="p-3 bg-purple-100 rounded-full">
          <Users className="h-6 w-6 text-purple-600" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm text-gray-500">Average Density</h3>
          <p className="text-lg font-semibold text-purple-600 mt-1">
            ${avgDensity} per sq.ft
          </p>
        </div>
      </div>

    </div>
      </div>
    </div>
  );
};

export default AdminSalesDensity;
