import React, { useState } from "react";
import Toggle from "Components/Admin/AdminSettings/Notification/Toggle";

const NotificationTab: React.FC = () => {
  const [notifications, setNotifications] = useState({
    personalizedOffers: true,
    onlineWebinars: true,
    newFeatures: true,
    securityAndBilling: false,
    marketing: false,
  });

  const updateNotification = (
    key: keyof typeof notifications,
    value: boolean
  ) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="font-gilroyRegular tracking-wider space-y-6">
      <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="text-sm font-medium">Personalized Offers</h3>
          <p className="text-xs text-gray-500">
            Receive offers made special for you
          </p>
        </div>
        <Toggle
          enabled={notifications.personalizedOffers}
          onChange={(value) => updateNotification("personalizedOffers", value)}
        />
      </div>
      <div className="border-t"></div>

      <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="text-sm font-medium">Online Webinars</h3>
          <p className="text-xs text-gray-500">
            Get notified about upcoming webinars
          </p>
        </div>
        <Toggle
          enabled={notifications.onlineWebinars}
          onChange={(value) => updateNotification("onlineWebinars", value)}
        />
      </div>
      <div className="border-t"></div>

      <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="text-sm font-medium">New Features</h3>
          <p className="text-xs text-gray-500">
            Updates about new features and product releases
          </p>
        </div>
        <Toggle
          enabled={notifications.newFeatures}
          onChange={(value) => updateNotification("newFeatures", value)}
        />
      </div>
      <div className="border-t"></div>

      <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="text-sm font-medium">Security and Billing</h3>
          <p className="text-xs text-gray-500">
            Account security and notifications about billing
          </p>
        </div>
        <Toggle
          enabled={notifications.securityAndBilling}
          onChange={(value) => updateNotification("securityAndBilling", value)}
        />
      </div>
      <div className="border-t"></div>

      <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="text-sm font-medium">Marketing</h3>
          <p className="text-xs text-gray-500">
            Receive marketing newsletters about our new products
          </p>
        </div>
        <Toggle
          enabled={notifications.marketing}
          onChange={(value) => updateNotification("marketing", value)}
        />
      </div>
    </div>
  );
};

export default NotificationTab;
