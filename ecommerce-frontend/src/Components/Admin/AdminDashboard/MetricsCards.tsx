import type React from "react";
import {
  useGetTotalRevenueQuery,
  useGetTotalOrdersQuery,
  useGetUniqueVisitsQuery,
  useGetNewUserQuery,
  useGetExistingUserQuery,
} from "Services/Admin/DashboardApiSlice";

interface MetricCardProps {
  title: string;
  value: string;
  change: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  iconBgColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  iconBgColor,
}) => {
  return (
    <div className="bg-white p-5 rounded-lg border shadow-sm flex justify-between items-center">
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-lg font-bold mt-1">{value}</p>
        <div
          className={`flex items-center mt-1 text-xs ${
            change.isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {change.isPositive ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-trending-up-icon lucide-trending-up"
            >
              <path d="M16 7h6v6" />
              <path d="m22 7-8.5 8.5-5-5L2 17" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-trending-down-icon lucide-trending-down"
            >
              <path d="M16 17h6v-6" />
              <path d="m22 17-8.5-8.5-5 5L2 7" />
            </svg>
          )}
          <span>{change.value}</span>
        </div>
      </div>
      <div className={`${iconBgColor} p-3 rounded-full`}>{icon}</div>
    </div>
  );
};

export const MetricsCards: React.FC = () => {
  const plant = process.env.REACT_APP_PLANT;

  const {
    data: totalRevenue,
    isLoading: loadingRevenue,
    error: errorRevenue,
  } = useGetTotalRevenueQuery({ plant });
  const {
    data: totalOrders,
    isLoading: loadingOrders,
    error: errorOrders,
  } = useGetTotalOrdersQuery({ plant });
  const {
    data: uniqueVisits,
    isLoading: loadingVisits,
    error: errorVisits,
  } = useGetUniqueVisitsQuery({ plant });
  const {
    data: newUsers,
    isLoading: loadingNewUsers,
    error: errorNewUsers,
  } = useGetNewUserQuery({ plant });
  const {
    data: existingUsers,
    isLoading: loadingExistingUsers,
    error: errorExistingUsers,
  } = useGetExistingUserQuery({ plant });

  const getValue = (
    loading: boolean,
    error: any,
    value: any,
    label: string
  ) => {
    if (loading) return "Loading...";
    if (error) return "0";
    if (value === undefined || value === null) return "0";
    if (label === "Total Revenue") {
      const match =
        typeof value === "string" ? value.match(/Rs\.?\s?(\d+[,.]?\d*)/) : null;
      const revenue = match ? match[1].replace(/,/g, "") : value;
      return `Rs. ${revenue}`;
    }
    if (label === "Orders") {
      const match = typeof value === "string" ? value.match(/(\d+)/) : null;
      const orders = match ? match[1] : value;
      return orders;
    }
    if (typeof value === "object") {
      const sum = Object.values(value).reduce(
        (acc: number, v) => acc + (typeof v === "number" ? v : 0),
        0
      );
      return sum.toLocaleString();
    }
    return value.toLocaleString();
  };

  const metrics = [
    {
      title: "Total Revenue",
      value: getValue(
        loadingRevenue,
        errorRevenue,
        totalRevenue,
        "Total Revenue"
      ),
      change: { value: "-", isPositive: true },
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-chart-bar-icon lucide-chart-bar"
        >
          <path d="M3 3v16a2 2 0 0 0 2 2h16" />
          <path d="M7 16h8" />
          <path d="M7 11h12" />
          <path d="M7 6h3" />
        </svg>
      ),
      iconBgColor: "bg-blue-100",
    },
    {
      title: "Orders",
      value: getValue(loadingOrders, errorOrders, totalOrders, "Orders"),
      change: { value: "-", isPositive: true },
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-shopping-bag-icon lucide-shopping-bag"
        >
          <path d="M16 10a4 4 0 0 1-8 0" />
          <path d="M3.103 6.034h17.794" />
          <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />
        </svg>
      ),
      iconBgColor: "bg-purple-100",
    },
    {
      title: "Unique Visits",
      value: getValue(
        loadingVisits,
        errorVisits,
        uniqueVisits,
        "Unique Visits"
      ),
      change: { value: "-", isPositive: true },
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-users-icon lucide-users"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <path d="M16 3.128a4 4 0 0 1 0 7.744" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      ),
      iconBgColor: "bg-orange-100",
    },
    {
      title: "New Users",
      value: getValue(loadingNewUsers, errorNewUsers, newUsers, "New Users"),
      change: { value: "-", isPositive: true },
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-user-plus-icon lucide-user-plus"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" x2="19" y1="8" y2="14" />
          <line x1="22" x2="16" y1="11" y2="11" />
        </svg>
      ),
      iconBgColor: "bg-green-100",
    },
    {
      title: "Existing Users",
      value: getValue(
        loadingExistingUsers,
        errorExistingUsers,
        existingUsers,
        "Existing Users"
      ),
      change: { value: "-", isPositive: true },
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-user-check-icon lucide-user-check"
        >
          <path d="m16 11 2 2 4-4" />
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      ),
      iconBgColor: "bg-indigo-100",
    },
  ];

  return (
    <div className="font-gilroyRegular tracking-wider grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6 font-gilroyRegular">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          icon={metric.icon}
          iconBgColor={metric.iconBgColor}
        />
      ))}
    </div>
  );
};
