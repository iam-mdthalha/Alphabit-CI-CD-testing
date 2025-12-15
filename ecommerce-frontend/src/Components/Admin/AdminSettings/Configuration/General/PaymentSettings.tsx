import React from "react";
import { useAppDispatch, useAppSelector } from "State/Hooks";
import { updateConfig } from "State/Admin/AdminSettings/ConfigurationSlice";

interface PaymentSettingsProps { }

const PaymentSettings: React.FC<PaymentSettingsProps> = () => {
  const dispatch = useAppDispatch();
  const config = useAppSelector((state: any) => state.configuration.config);

  const handleToggle = (field: keyof typeof config) => {
    dispatch(updateConfig({
      [field]: config[field] === 1 ? 0 : 1
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(updateConfig({
      [e.target.id]: e.target.value
    }));
  };

  return (
    <div className="font-gilroyRegular tracking-wider bg-white p-4 rounded-md border border-gray-200">
      <h4 className="text-xs font-medium text-gray-700 mb-3">Payment Settings</h4>
      <div className="space-y-3">
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">Select Payment Method</div>
          <div className="space-y-2 pl-1">
            <div className="flex items-center">
              {/* onlinePayment */}
              <input
                id="onlinePayment"
                type="checkbox"
                checked={config.onlinePayment === 1}
                onChange={() => handleToggle('onlinePayment')}
                className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="onlinePayment" className="ml-2 block text-xs text-gray-700">
                Online Payment
              </label>
            </div>
            <div className="flex items-center">
              {/* isWhatsapp */}
              <input
                id="isWhatsapp"
                type="checkbox"
                checked={config.isWhatsapp === 1}
                onChange={() => handleToggle('isWhatsapp')}
                className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="isWhatsapp" className="ml-2 block text-xs text-gray-700">
                WhatsApp Inquiry (No Cart)
              </label>
            </div>
          </div>
        </div>
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="text-xs font-medium text-gray-700 mb-2">WhatsApp Inquiry Settings</div>
          <div className="space-y-3">
            <div>
              {/* whatsappNumber */}
              <label htmlFor="whatsapp-number" className="block text-xs font-medium text-gray-700 mb-1">
                WhatsApp Number
              </label>
              <input
                id="whatsappNumber"
                type="text"
                value={config.whatsappNumber}
                onChange={handleInputChange}
                placeholder="+1234567890"
                maxLength={13}
                className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="inquiry-message" className="block text-xs font-medium text-gray-700 mb-1">
                WhatsApp Default Inquiry Message
              </label>
              {/* defaultInquiryMessage */}
              <textarea
                id="defaultInquiryMessage"
                rows={3}
                value={config.defaultInquiryMessage}
                onChange={handleInputChange}
                maxLength={1000}
                className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="text-right text-[10px] text-gray-400 mt-1">
                {config.defaultInquiryMessage?.length || 0}/1000
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;
