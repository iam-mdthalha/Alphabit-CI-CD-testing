"use client";

import { useState } from "react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SizeData = {
  inches: string[][];
  cm: string[][];
};

const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"inches" | "cm">("inches");

  const sizeData: SizeData = {
    inches: [
      [
        "Size",
        "Garment Chest",
        "To fit Chest (body measurement)",
        "Garment Across Shoulder",
        "Garment Sleeve Length",
        "Garment Length",
      ],
      ["36", "39", "35 - 36", "17", "24","27.5"],
      ["38", "41", "37 - 38", "17.5", "24.5", "28.5"],
      ["40", "44", "39 - 40", "18.5", "25.5", "28.5"],
      ["42", "48", "41 - 43", "19.5", "25.5",  "29.5"],
      ["44", "50", "44 - 46", "20", "26",  "30.5"],
    ],
    cm: [
      [
        "Size",
        "Garment chest",
        "To fit Chest(body measurement)",
        "Garment Across Shoulder",
        "Garment Sleeve Length",
        "Garment Length",
      ],
      ["36", "99.1", "88.9 - 91.4", "43.2", "61.0", "69.8"],
    ["38", "104.1", "94.0 - 96.5", "44.5", "62.2", "72.4"],
    ["40", "111.8", "99.1 - 101.6", "47.0", "64.8", "72.4"],
    ["42", "121.9", "104.1 - 109.2", "49.5", "64.8", "74.9"],
    ["44", "127.0", "111.8 - 116.8", "50.8", "66.0", "77.5"],
    ],
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white p-6 rounded-lg w-[90vw] max-h-[90vh] overflow-y-auto">
        <div className="w-full flex justify-between gap-2">
          <div className="flex gap-2 mb-4">
            <button
              className={`text-sm px-4 py-2 border border-black uppercase hover:border-blue-500 hover:bg-blue-500 hover:text-white ${
                activeTab === "inches" ? "bg-black text-white" : ""
              }`}
              onClick={() => setActiveTab("inches")}
            >
              Inches
            </button>
            <button
              className={`text-sm px-4 py-2 border border-black uppercase hover:border-blue-500 hover:bg-blue-500 hover:text-white ${
                activeTab === "cm" ? "bg-black text-white" : ""
              }`}
              onClick={() => setActiveTab("cm")}
            >
              CM
            </button>
          </div>
          <div className="flex justify-end items-end mb-4">
            <button onClick={onClose} className="text-2xl">
              &times;
            </button>
          </div>
        </div>
        <div className="flex">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {sizeData[activeTab][0].map((header: string, index: number) => (
                  <th key={index} className="border p-2 text-center">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizeData[activeTab]
                .slice(1)
                .map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex}>
                    {row.map((cell: string, cellIndex: number) => (
                      <td key={cellIndex} className="border p-2 text-center">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
