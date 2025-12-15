import { FileUpload } from "Components/Admin/StyleComponent/FileUpload";
import React from "react";

const ProfileTab: React.FC = () => {
  const handleFileSelect = (file: File | null) => {
  };
  
  return (
    <div className="font-gilroyRegular tracking-wider space-y-8">
      <div>
        <h2 className="text-sm font-medium">Profile Details</h2>
        <p className="text-xs text-gray-500 mt-1">
          Enter your profile information
        </p>

        <div className="mt-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Profile Image
          </label>
          <FileUpload onFileSelect={handleFileSelect} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md text-xs"
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md text-xs"
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md text-xs"
              placeholder="john.doe@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full px-3 py-2 border rounded-md text-xs"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-sm font-medium">Regional Settings</h2>
        <p className="text-xs text-gray-500 mt-1">
          Set your language and timezone
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Language
            </label>
            <select className="w-full px-3 py-2 border rounded-md text-xs">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Chinese</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Timezone
            </label>
            <select className="w-full px-3 py-2 border rounded-md text-xs">
              <option>(GMT-08:00) Pacific Time</option>
              <option>(GMT-05:00) Eastern Time</option>
              <option>(GMT+00:00) UTC</option>
              <option>(GMT+01:00) Central European Time</option>
              <option>(GMT+05:30) Indian Standard Time</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;