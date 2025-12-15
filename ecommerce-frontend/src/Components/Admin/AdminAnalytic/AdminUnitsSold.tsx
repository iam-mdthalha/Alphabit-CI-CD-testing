import React from "react";

const AdminUnitsSold = () => {
  const metrics = [
    {
      title: "Total Units Sold",
      value: "32%",
      change: "+4.2%",
      changeType: "positive",
      progress: 32,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-indigo-600 dark:text-indigo-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3v18h18M9 17l3-3 3 3 4-4"
          />
        </svg>
      ),
      iconBg: "bg-indigo-100 dark:bg-indigo-800",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      title: "Operating Expense Ratio",
      value: "18.5%",
      change: "+1.3%",
      changeType: "negative",
      progress: 18.5,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-amber-600 dark:text-amber-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-2.21 0-4 1.79-4 4m8 0a4 4 0 00-4-4m0 0V4m0 4v16"
          />
        </svg>
      ),
      iconBg: "bg-amber-100 dark:bg-amber-800",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      title: "Avg. Sales per Employee",
      value: "$4.2k",
      change: "+2.7%",
      changeType: "positive",
      progress: 55,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-emerald-600 dark:text-emerald-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 1.343-3 3 0 1.306.835 2.418 2 2.83V18m0-4.17c1.165.412 2 .524 2 1.83 0 1.657-1.343 3-3 3"
          />
        </svg>
      ),
      iconBg: "bg-emerald-100 dark:bg-emerald-800",
      gradient: "from-emerald-500 to-green-500"
    },
    {
      title: "Customer Satisfaction",
      value: "94%",
      change: "+5.1%",
      changeType: "positive",
      progress: 94,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-rose-600 dark:text-rose-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      iconBg: "bg-rose-100 dark:bg-rose-800",
      gradient: "from-rose-500 to-pink-500"
    }
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl shadow-md bg-white dark:bg-neutral-900 flex flex-col justify-between hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-neutral-800"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 truncate">
                {metric.title}
              </h3>
              <div className={`p-2 rounded-full ${metric.iconBg} flex-shrink-0 ml-2`}>
                {metric.icon}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-1">
                {metric.value}
              </p>
              <p
                className={`text-xs font-medium ${
                  metric.changeType === "positive"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {metric.change} vs last month
              </p>
            </div>

            <div className="w-full bg-gray-200 dark:bg-neutral-800 h-3 rounded-full overflow-hidden">
              <div
                className={`bg-gradient-to-r ${metric.gradient} h-3 rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${metric.progress}%` }}
              />
            </div>

            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {metric.progress}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUnitsSold;