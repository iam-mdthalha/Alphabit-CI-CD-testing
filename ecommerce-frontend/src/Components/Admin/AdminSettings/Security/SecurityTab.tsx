import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import Toggle from "Components/Admin/AdminSettings/Notification/Toggle";
import React, { useEffect, useState } from "react";
import { useGetSecurityConfigQuery, useSaveOrUpdateSecurityConfigMutation } from "Services/Admin/SecurityConfigApiSlice";
import { updateConfig } from "State/Admin/AdminSettings/ConfigurationSlice";
import { useAppDispatch, useAppSelector } from "State/Hooks";
import { RootState } from "State/store";

interface SecurityFormData {
  isTwoFactorEnabled: boolean;
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioOutgoingSmsNumber: string;
}


const SecurityTab: React.FC = () => {
  const { data: securityConfig, isLoading, error, isError } = useGetSecurityConfigQuery();
  const [saveOrUpdateSecurityConfig] = useSaveOrUpdateSecurityConfigMutation();

  const handleTwoFactorToggle = () => {
    setFormData((prev) => ({ ...prev, isTwoFactorEnabled: !prev.isTwoFactorEnabled }));
  }

  const [formData, setFormData] = useState<SecurityFormData>({
    isTwoFactorEnabled: false,
    twilioAccountSid: "",
    twilioAuthToken: "",
    twilioOutgoingSmsNumber: ""
  });
  
  useEffect(() => {
    if(securityConfig?.results) {
      setFormData({
        isTwoFactorEnabled: securityConfig.results.twoFactorEnabled || false,
        twilioAccountSid: securityConfig.results.twilioAccountSid || "",
        twilioAuthToken: securityConfig.results.twilioAuthToken || "",
        twilioOutgoingSmsNumber: securityConfig.results.twilioOutgoingSmsNumber || ""
      })
    }
  }, [securityConfig]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        const createPayload = {
          ...formData,
        };

        await saveOrUpdateSecurityConfig(createPayload).unwrap();

        notifications.show({
          title: "Success",
          message: "Payment configuration created successfully!",
          color: "green",
          icon: <IconCheck size={18} />,
        });
      } catch (error) {
        console.error("Failed to save security config:", error);
        notifications.show({
          title: "Error",
          message: "Failed to save security configuration",
          color: "red",
          icon: <IconX size={18} />,
        });
      }
    };

    const dispatch = useAppDispatch();
    const config = useAppSelector((state: RootState) => state.configuration.config);
  
    const handleFast2SmsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updateConfig({
        fast2SmsApiKey: e.target.value
      }));
    };
  
    if (isLoading) return <div>Loading...</div>;

  return (
    <div className="font-gilroyRegular tracking-wider space-y-8">
      <div>
        <h2 className="text-sm font-medium">Change Password</h2>
        <p className="text-xs text-gray-500 mt-1">
          Update your password to keep your account secure
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md text-xs"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md text-xs"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md text-xs"
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-sm font-medium">External API</h2>
        <p className="text-xs text-gray-500 mt-1">
          Provide the API Key for the following External API
        </p>

        <div className="flex items-center gap-10 mt-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Fast2SMS
            </label>
            <input
              type="text"
              value={config.fast2SmsApiKey}
              onChange={handleFast2SmsChange}
              className="w-full px-3 py-2 border rounded-md text-xs"
              placeholder="Enter API Key"
            />
          </div>
          <div>
            <img 
              src="/logo/fast2sms.png"
              alt="Fast2SMS Icon"
              className="w-32 bg-gray-800 px-4 py-2 rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-sm font-medium">Two-Factor Authentication</h2>
        <p className="text-xs text-gray-500 mt-1">
          Add an extra layer of security to your account
        </p>
        <form onSubmit={handleSubmit} className="p-6 rounded w-full">
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                <p className="text-xs text-gray-500">
                  Protect your account with 2FA
                </p>
              </div>
              <Toggle enabled={formData.isTwoFactorEnabled} onChange={handleTwoFactorToggle} />
            </div>
          </div>

          {
            formData.isTwoFactorEnabled && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Twilio Account Sid
                  </label>
                  <input
                    type="text"
                    required
                    name="twilioAccountSid"
                    onChange={handleChange}
                    value={formData.twilioAccountSid}
                    className="w-full px-3 py-2 border rounded-md text-xs"
                    placeholder="Enter Twilio Account Sid"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Twilio Auth Token
                  </label>
                  <input
                    type="text"
                    required
                    name="twilioAuthToken"
                    onChange={handleChange}
                    value={formData.twilioAuthToken}
                    className="w-full px-3 py-2 border rounded-md text-xs"
                    placeholder="Enter Twilio Auth Token"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Twilio Outgoing SMS Number
                  </label>
                  <input
                    type="text"
                    required
                    name="twilioOutgoingSmsNumber"
                    onChange={handleChange}
                    value={formData.twilioOutgoingSmsNumber}
                    className="w-full px-3 py-2 border rounded-md text-xs"
                    placeholder="Enter Twilio Outgoing SMS Number"
                  />
                </div>
                
              </div>
            )
          }
          <div className="flex mt-2">
            <button
              type="submit"
              className="text-xs font-medium bg-blue-600 ml-auto text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {securityConfig ? "Update Configuration" : "Save Configuration"}
            </button>
          </div>
          
        </form>

        
      </div>

      <div className="border-t pt-6">
        <h2 className="text-sm font-medium">Sessions</h2>
        <p className="text-xs text-gray-500 mt-1">
          Manage your active sessions
        </p>

        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium">Current Session</h3>
                <p className="text-xs text-gray-500">
                  Windows • Chrome • New York, USA
                </p>
              </div>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium">Mobile Session</h3>
                <p className="text-xs text-gray-500">
                  iOS • Safari • San Francisco, USA
                </p>
              </div>
            </div>
            <button className="text-xs text-red-600 hover:text-red-800">
              Revoke
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
