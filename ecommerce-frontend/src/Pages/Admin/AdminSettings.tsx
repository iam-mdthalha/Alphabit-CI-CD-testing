"use client";

import React, { useState, useEffect } from "react";
import { useUpdateConfigurationMutation, useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";
import { notifications } from "@mantine/notifications";
import { useAppDispatch, useAppSelector } from "State/Hooks";
import { setConfig, resetChanges, updateConfig, setHasChanges } from "State/Admin/AdminSettings/ConfigurationSlice";
import { EcommerceConfigDto } from "Types/Admin/Settings/Configuration/AdminCofigurationType";
import ProfileTab from "Components/Admin/AdminSettings/Profile/ProfileTab";
import NotificationTab from "Components/Admin/AdminSettings/Notification/NotificationTab";
import AccountsTab from "Components/Admin/AdminSettings/Accounts/AccountsTab";
import SecurityTab from "Components/Admin/AdminSettings/Security/SecurityTab";
import ConfigurationTab from "Components/Admin/AdminSettings/Configuration/ConfigurationTab";
import PaymentTab from "Components/Admin/AdminSettings/Payment/PaymentTab";

type TabType = "profile" | "notification" | "accounts" | "security" | "configuration" | "payment";

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const PLANT = process.env.REACT_APP_PLANT || "";
  const { data: existingConfig, isLoading, isSuccess } = useGetConfigurationByPlantQuery(PLANT);
  const [updateConfiguration] = useUpdateConfigurationMutation();
  const dispatch = useAppDispatch();
  const { config, hasChanges } = useAppSelector((state: any) => state.configuration);

  useEffect(() => {
    if (isSuccess && existingConfig) {
      dispatch(setConfig(existingConfig));
    }
  }, [existingConfig, isSuccess, dispatch]);

  const handleTabChange = (tab: TabType) => {
    if (hasChanges) {
      const confirmChange = window.confirm("You have unsaved changes. Are you sure you want to switch tabs?");
      if (!confirmChange) return;
    }
    setActiveTab(tab);
  };

  const handleCancel = () => {
    if (existingConfig) {
      dispatch(setConfig(existingConfig));
      dispatch(resetChanges());
    }
  };

  const handleSave = async () => {
    try {
      await updateConfiguration(config).unwrap();
      notifications.show({
        title: "Success",
        message: "Settings updated successfully",
        color: "green",
      });
      dispatch(resetChanges());
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update Settings",
        color: "red",
      });
    }
  };

  return (
    <div className="font-gilroyRegular p-6 max-w-7xl mx-auto">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            disabled={!hasChanges}
            className={`px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 ${hasChanges ? "text-blue-600" : "text-gray-400 cursor-not-allowed"
              }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-4 py-2 text-sm text-white rounded-md ${hasChanges ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Save
          </button>
        </div>
      </header>

      <div className="mt-6 bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="flex border-b">
          {(["profile", "notification", "accounts", "security", "configuration", "payment"] as TabType[]).map((tab) => (
            <button
              key={tab}
              className={`px-6 py-4 text-xs font-medium relative ${activeTab === tab ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "notification" && <NotificationTab />}
          {activeTab === "accounts" && <AccountsTab />}
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "configuration" && <ConfigurationTab />}
          {activeTab === "payment" && <PaymentTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
