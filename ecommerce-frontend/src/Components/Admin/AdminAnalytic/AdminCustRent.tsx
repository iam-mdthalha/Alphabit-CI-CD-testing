import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { UserPlus, UserCheck, Percent } from "lucide-react";

interface RetentionData {
  month: string;
  new: number;
  retained: number;
}

interface AdminCustRentProps {
  data: RetentionData[];
}

const AdminCustRent: React.FC<AdminCustRentProps> = ({ data }) => {
  const totalNew = data.reduce((sum, d) => sum + d.new, 0);
  const totalRetained = data.reduce((sum, d) => sum + d.retained, 0);
  const retentionRate =
    totalNew > 0 ? ((totalRetained / totalNew) * 100).toFixed(1) : "0";

  return (
    <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Customer Retention</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-xl shadow-sm p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="new"
                fill="#4ade80"
                radius={[4, 4, 0, 0]}
                name="New Customers"
              />
              <Bar
                dataKey="retained"
                fill="#fca5a5"
                radius={[4, 4, 0, 0]}
                name="Retained Customers"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full lg:w-64 flex flex-col gap-4">
          <div className="flex items-center p-4 bg-white rounded-xl shadow border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="p-3 bg-green-100 rounded-full">
              <UserPlus className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm text-gray-500">Total New Customers</h3>
              <p className="text-2xl font-bold text-green-600 mt-1">{totalNew}</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-white rounded-xl shadow border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="p-3 bg-red-100 rounded-full">
              <UserCheck className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm text-gray-500">Total Retained Customers</h3>
              <p className="text-2xl font-bold text-red-600 mt-1">{totalRetained}</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-white rounded-xl shadow border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="p-3 bg-indigo-100 rounded-full">
              <Percent className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm text-gray-500">Retention Rate</h3>
              <p className="text-2xl font-bold text-indigo-600 mt-1">{retentionRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustRent;
