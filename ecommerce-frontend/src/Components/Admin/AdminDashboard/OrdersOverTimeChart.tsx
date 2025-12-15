"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useGetOrdersOverTimeQuery } from "Services/Admin/DashboardApiSlice";

const timeRangeToHours: Record<string, number> = {
  last12Hours: 12,
  last24Hours: 24,
  last7Days: 7,
  last30Days: 30,
};

const timeRangeLabels: Record<string, string> = {
  last12Hours: "Last 12 Hours",
  last24Hours: "Last 24 Hours",
  last7Days: "Last 7 Days",
  last30Days: "Last 30 Days",
};

const sortDailyData = (
  data: Record<string, number>
): Record<string, number> => {
  const entries = Object.entries(data);
  if (entries[0] && entries[0][0].includes("/")) {
    entries.sort(([dateA], [dateB]) => {
      const [dayA, monthA, yearA] = dateA.split("/").map(Number);
      const [dayB, monthB, yearB] = dateB.split("/").map(Number);
      return (
        new Date(yearA, monthA - 1, dayA).getTime() -
        new Date(yearB, monthB - 1, dayB).getTime()
      );
    });
  }
  return Object.fromEntries(entries);
};

const formatDateLabel = (dateStr: string, timeRange: string): string => {
  if (timeRange === "last30Days" || timeRange === "last7Days") {
    const [day, month] = dateStr.split("/");
    return `${day}/${month}`;
  }

  if (timeRange === "last12Hours" || timeRange === "last24Hours") {
    if (/^\d{2}:\d{2}$/.test(dateStr)) return dateStr;

    const [hour, minute] = dateStr.split(":");
    if (
      typeof hour !== "undefined" &&
      typeof minute !== "undefined" &&
      !isNaN(Number(hour)) &&
      !isNaN(Number(minute)) &&
      hour !== "" &&
      minute !== ""
    ) {
      const h = String(Number(hour)).padStart(2, "0");
      const m = String(Number(minute)).padStart(2, "0");
      return `${h}:${m}`;
    }

    return dateStr;
  }
  return dateStr;
};

interface ChartDataItem {
  time: string;
  today: number;
  yesterday: number;
}

export const OrdersOverTimeChart: React.FC = () => {
  const plant = process.env.REACT_APP_PLANT;
  const [timeRange, setTimeRange] = useState<string>("last12Hours");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    data: orderData = {},
    isLoading,
    isError,
    refetch,
  } = useGetOrdersOverTimeQuery({
    plant,
    timeRange: timeRangeToHours[timeRange],
  });

  useEffect(() => {
    refetch();
  }, [timeRange, refetch]);

  const processChartData = (): ChartDataItem[] => {
    const processedData =
      timeRange === "last7Days" || timeRange === "last30Days"
        ? sortDailyData(orderData)
        : orderData;

    return Object.entries(processedData).map(([time, count]) => ({
      time: formatDateLabel(time, timeRange),
      today: Number(count),
      yesterday: 0,
    }));
  };

  const chartData: ChartDataItem[] = processChartData();
  const maxValue = Math.max(...chartData.map((item) => item.today), 1);

  const getChartConfig = () => {
    switch (timeRange) {
      case "last30Days":
        return {
          barWidth: 30,
          spacing: 16,
          showEvery: 3,
        };
      case "last7Days":
        return {
          barWidth: 60,
          spacing: 24,
          showEvery: 1,
        };
      case "last24Hours":
        return {
          barWidth: 30,
          spacing: 16,
          showEvery: 2,
        };
      default:
        return {
          barWidth: 40,
          spacing: 20,
          showEvery: 1,
        };
    }
  };

  const { barWidth, spacing, showEvery } = getChartConfig();
  const chartWidth = chartData.length * (barWidth + spacing);
  const chartHeight = 320;
  const chartMargin = { top: 20, right: 20, bottom: 40, left: 40 };

  const yAxisValues = [];
  const steps = maxValue <= 5 ? 1 : Math.ceil(maxValue / 5);
  for (let i = 0; i <= maxValue; i += steps) {
    yAxisValues.push(i);
  }
  if (yAxisValues[yAxisValues.length - 1] < maxValue) {
    yAxisValues.push(maxValue);
  }

  if (!isClient) {
    return (
      <div className="bg-white p-5 rounded-lg border shadow-sm h-[350px] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isLoading || isError) {
    return (
      <div className="bg-white p-5 rounded-lg border shadow-sm h-[350px]">
        <div className="flex flex-row items-center justify-between pb-4">
          <h2 className="text-lg font-semibold">Orders Over Time</h2>
          <div className="relative">
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50">
              {timeRangeLabels[timeRange]}
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
                className="lucide lucide-chevron-down h-4 w-4"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>
        </div>
        <div className="h-[280px] flex items-center justify-center">
          {isLoading ? "Loading chart data..." : "Error loading chart data"}
        </div>
      </div>
    );
  }

  return (
    <div className="font-gilroyRegular tracking-wider bg-white p-5 rounded-lg border shadow-sm h-[500px]">
      <div className="flex flex-row items-center justify-between pb-4">
        <h2 className="text-lg font-semibold">Orders Over Time</h2>
        <div className="relative">
          <button
            className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {timeRangeLabels[timeRange]}
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
              className="lucide lucide-chevron-down h-4 w-4"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-[180px] bg-white border rounded-md shadow-lg z-10">
              <div className="py-1">
                {Object.keys(timeRangeLabels).map((range) => (
                  <button
                    key={range}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setTimeRange(range);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {timeRangeLabels[range]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-[350px] relative">
        {" "}
        {/* Increased height from 280px to 350px */}
        <div className="absolute left-0 top-0 h-full w-10 flex flex-col justify-between text-sm text-gray-500 pr-2">
          {[...yAxisValues].reverse().map((value, index) => (
            <div
              key={index}
              className="flex items-center justify-end"
              style={{
                height: `${chartHeight / (yAxisValues.length - 1)}px`,
                marginTop: index === 0 ? 0 : "-0.75rem",
                transform: `translateY(${
                  index === yAxisValues.length - 1 ? "0.5rem" : "0"
                })`,
              }}
            >
              {value}
            </div>
          ))}
        </div>
        <div className="ml-10 h-full overflow-hidden hover:overflow-x-auto scrollbar-hide">
          <div style={{ width: `${chartWidth}px` }}>
            <svg
              className="h-[300px] w-full"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
            >
              {yAxisValues.map((value, index) => {
                const y = chartHeight - (value / maxValue) * chartHeight;
                return (
                  <line
                    key={index}
                    x1="0"
                    y1={y}
                    x2={chartWidth}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                );
              })}

              <polyline
                points={chartData
                  .map((item, index) => {
                    const x = index * (barWidth + spacing) + barWidth / 2;
                    const y =
                      chartHeight - (item.today / maxValue) * chartHeight;
                    return `${x},${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              />

              {chartData.map((item, index) => {
                const x = index * (barWidth + spacing) + barWidth / 2;
                const y = chartHeight - (item.today / maxValue) * chartHeight;
                return (
                  <circle
                    key={`today-${index}`}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#3b82f6"
                  />
                );
              })}
            </svg>

            {/* X-axis labels: all, rotated -45deg */}
            <div className="flex mt-2" style={{ width: `${chartWidth}px` }}>
              {chartData.map((item, index) => (
                <div
                  key={index}
                  className="text-xs text-gray-500 flex-shrink-0 text-center"
                  style={{
                    width: `${barWidth}px`,
                    marginLeft: `${spacing / 2}px`,
                    marginRight: `${spacing / 2}px`,
                    lineHeight: "1.5",
                    transform: "rotate(-45deg)",
                    transformOrigin: "top right",
                    whiteSpace: "nowrap",
                    height: "32px",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  {item.time}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
