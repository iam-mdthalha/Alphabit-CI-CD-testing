import type React from "react";
import { useGetRecentTransactionsQuery } from "Services/Admin/DashboardApiSlice";

export const RecentTransactionsTable: React.FC = () => {
  const plant = process.env.REACT_APP_PLANT;
  const {
    data: transactions,
    isLoading,
    error,
  } = useGetRecentTransactionsQuery({ plant });

  return (
    <div className="font-gilroyRegular tracking-wider bg-white p-5 rounded-lg border shadow-sm">
      <h2 className="text-base font-medium mb-4">Recent Transaction</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-gray-500 mb-2">No data available.</div>
      ) : !transactions || transactions.length === 0 ? (
        <div>No data available.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-medium text-sm">
                  Name
                </th>
                <th className="text-left py-3 px-2 font-medium text-sm">
                  Date
                </th>
                <th className="text-left py-3 px-2 font-medium text-sm">
                  Amount
                </th>
                <th className="text-left py-3 px-2 font-medium text-sm">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction: any) => (
                <tr key={transaction.id} className="border-b">
                  <td className="py-3 px-2 font-medium text-sm">
                    {transaction.name}
                  </td>
                  <td className="py-3 px-2 text-gray-600 text-sm">
                    {transaction.date}
                  </td>
                  <td className="py-3 px-2 text-sm">{transaction.amount}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {transaction.status === "paid" ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
