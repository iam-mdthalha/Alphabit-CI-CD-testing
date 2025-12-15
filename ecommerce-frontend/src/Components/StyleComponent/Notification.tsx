import React, { createContext, useContext, useState, ReactNode } from "react";

// --- Types ---
type NotificationColor = "teal" | "red" | "yellow" | "blue" | "green" | "gray";
type ShowNotificationArgs = {
  title: string;
  message: string;
  color?: NotificationColor;
};

// For Mantine-like API compatibility
export const notifications = {
  show: (args: ShowNotificationArgs) => {
    // This will be replaced at runtime by the provider
    // eslint-disable-next-line no-console
    console.warn("NotificationProvider is not mounted");
  },
};

interface NotificationProps {
  id: number;
  title: string;
  message: string;
  color?: NotificationColor;
  onClose: () => void;
}

const colorMap: Record<NotificationColor, string> = {
  teal: "border-teal-500 bg-teal-50 text-teal-900",
  red: "border-red-500 bg-red-50 text-red-900",
  yellow: "border-yellow-500 bg-yellow-50 text-yellow-900",
  blue: "border-blue-500 bg-blue-50 text-blue-900",
  green: "border-green-500 bg-green-50 text-green-900",
  gray: "border-gray-400 bg-gray-50 text-gray-900",
};

const Notification: React.FC<NotificationProps> = ({
  title,
  message,
  color = "teal",
  onClose,
}) => (
  <div
    className={`w-full max-w-sm shadow-lg rounded-lg border-l-4 p-4 mb-3 flex flex-col gap-1 animate-slide-in ${colorMap[color]}`}
    style={{ zIndex: 9999 }}
  >
    <div className="flex justify-between items-center">
      <div className="font-semibold">{title}</div>
      <button
        className="text-xl font-bold text-gray-400 hover:text-gray-700"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
    <div className="text-sm">{message}</div>
  </div>
);

// --- Context and Provider ---
type NotificationContextType = {
  show: (args: ShowNotificationArgs) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

let idCounter = 0;

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notificationsList, setNotifications] = useState<
    Array<NotificationProps>
  >([]);

  const show = ({ title, message, color = "teal" }: ShowNotificationArgs) => {
    const id = ++idCounter;
    setNotifications((prev) => [
      ...prev,
      {
        id,
        title,
        message,
        color,
        onClose: () =>
          setNotifications((prev) => prev.filter((n) => n.id !== id)),
      },
    ]);
    // Auto-close after 3 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  // Patch the exported notifications object
  notifications.show = show;

  return (
    <NotificationContext.Provider value={{ show }}>
      {children}
      <div
        className="fixed top-6 right-6 flex flex-col items-end gap-2"
        style={{ zIndex: 9999 }}
      >
        {notificationsList.map((n) => (
          <Notification key={n.id} {...n} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return ctx;
};

// Optional: Add a simple slide-in animation
// Add this to your global CSS or Tailwind config:
// .animate-slide-in { animation: slide-in 0.3s cubic-bezier(0.4,0,0.2,1); }
// @keyframes slide-in { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: none; } }