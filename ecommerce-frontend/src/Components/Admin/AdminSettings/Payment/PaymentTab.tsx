import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  useGetPaymentConfigQuery,
  useSavePaymentConfigMutation,
  useUpdatePaymentConfigMutation,
} from "Services/Admin/AdminPaymentApiSlice";
import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";

interface PaymentFormData {
  gatewayProvider: string;
  email: string;
  accessTokenId: string;
  clientId: string;
  secretId: string;
  environment: string;
  isActive: string;
}

const AdminPaymentTab = () => {
  const { data: paymentConfig, isLoading, error, isError } = useGetPaymentConfigQuery();
  const [savePaymentConfig] = useSavePaymentConfigMutation();
  const [updatePaymentConfig] = useUpdatePaymentConfigMutation();

  useEffect(() => {
  }, [paymentConfig, isLoading, isError, error]);

  const [formData, setFormData] = useState<PaymentFormData>({
    gatewayProvider: "Stripe",
    email: "",
    accessTokenId: "",
    clientId: "",
    secretId: "",
    environment: "0",
    isActive: "1",
  });

  useEffect(() => {
    if (paymentConfig?.results) {
      const config = paymentConfig.results;
      setFormData({
        gatewayProvider: config.gatewayProvider || "Stripe",
        email: config.email || "",
        accessTokenId: config.accessTokenId || "",
        clientId: config.clientId || "",
        secretId: config.secretId || "",
        environment: config.environment?.toString() || "0",
        isActive: config.isActive?.toString() || "1",
      });
    }
  }, [paymentConfig]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (paymentConfig) {
        const updatePayload = {
          ...formData,
          id: paymentConfig.results.id,
          isActive: formData.isActive,
        };

        await updatePaymentConfig(updatePayload).unwrap();

        notifications.show({
          title: "Success",
          message: "Payment configuration updated successfully!",
          color: "green",
          icon: <IconCheck size={18} />,
        });
      } else {
        const createPayload = {
          ...formData,
          isActive: formData.isActive,
        };

        await savePaymentConfig(createPayload).unwrap();

        notifications.show({
          title: "Success",
          message: "Payment configuration created successfully!",
          color: "green",
          icon: <IconCheck size={18} />,
        });
      }
    } catch (error) {
      console.error("Failed to save payment config:", error);
      notifications.show({
        title: "Error",
        message: "Failed to save payment configuration",
        color: "red",
        icon: <IconX size={18} />,
      });
    }
  };

  if (isLoading) return <div className="w-full h-screen justify-center items-center"><CircleLoader /></div>;

  return (
    <div className="font-gilroyRegular tracking-wider flex justify-center items-center">
      <form onSubmit={handleSubmit} className="p-6 rounded w-full max-w-2xl">
        <h2 className="text-sm font-medium mb-6 text-center">
          {paymentConfig ? "Update Payment Gateway" : "Create Payment Gateway"}
        </h2>

        <div className="mb-4 flex items-center">
          <label className="w-48 text-xs font-medium text-gray-700">Gateway Provider:</label>
          <select
            name="gatewayProvider"
            value={formData.gatewayProvider}
            onChange={handleChange}
            className="border p-2 w-full max-w-md rounded text-xs font-medium text-gray-700"
          >
            <option value="stripe">Stripe</option>
            <option value="razorpay">Razorpay</option>
          </select>
        </div>

        <div className="mb-4 flex items-center">
          <label className="w-48 text-xs font-medium text-gray-700">*Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 w-full max-w-md rounded text-xs font-medium text-gray-700"
            required
          />
        </div>

        {
          formData.gatewayProvider !== "razorpay" &&
            <div className="mb-4 flex items-center">
              <label className="w-48 text-xs font-medium text-gray-700">*Access Token Id:</label>
              <input
                type="text"
                name="accessTokenId"
                value={formData.accessTokenId}
                onChange={handleChange}
                className="border p-2 w-full max-w-md rounded text-xs font-medium text-gray-700"
                required
              />
            </div>
        }
        

        <div className="mb-4 flex items-center">
          <label className="w-48 text-xs font-medium text-gray-700">*Client Id:</label>
          <input
            type="text"
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            className="border p-2 w-full max-w-md rounded text-xs font-medium text-gray-700"
            required
          />
        </div>

        <div className="mb-4 flex items-center">
          <label className="w-48 text-xs font-medium text-gray-700">*Secret Id:</label>
          <input
            type="text"
            name="secretId"
            value={formData.secretId}
            onChange={handleChange}
            className="border p-2 w-full max-w-md rounded text-xs font-medium text-gray-700"
            required
          />
        </div>

        <div className="mb-4 flex items-center">
          <label className="w-48 text-xs font-medium text-gray-700">*Environment:</label>
          <div className="flex gap-4">
            <label className="flex items-center text-xs font-medium text-gray-700">
              <input
                type="radio"
                name="environment"
                value="0"
                checked={formData.environment === "0"}
                onChange={handleChange}
                className="mr-2"
              />
              Sandbox
            </label>
            <label className="flex items-center text-xs font-medium text-gray-700">
              <input
                type="radio"
                name="environment"
                value="1"
                checked={formData.environment === "1"}
                onChange={handleChange}
                className="mr-2"
              />
              Live
            </label>
          </div>
        </div>

        <div className="flex">
          <button
            type="submit"
            className="text-xs font-medium bg-blue-600 ml-auto text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {paymentConfig ? "Update Configuration" : "Save Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPaymentTab;