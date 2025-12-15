import React from "react";

interface TimeRangeDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const options = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7", label: "Last 7 days" },
  { value: "thisWeek", label: "This week" },
  { value: "last15", label: "Last 15 days" },
  { value: "thisMonth", label: "This month" },
  { value: "last30", label: "Last 30 days" },
  { value: "lastMonth", label: "Last month" },
  { value: "thisQuarter", label: "This quarter" },
  { value: "lastQuarter", label: "Last quarter" },
  { value: "thisYear", label: "This year" },
  { value: "lastYear", label: "Last year" },
];

const getLabel = (value: string) => {
  const found = options.find((opt) => opt.value === value);
  return found ? found.label : value;
};

const TimeRangeDropdown: React.FC<TimeRangeDropdownProps> = ({
  value,
  onChange,
}) => {
  return (
    <select
      className="font-gilroyRegular tracking-wider border rounded px-2 py-1 text-xs"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default TimeRangeDropdown;
