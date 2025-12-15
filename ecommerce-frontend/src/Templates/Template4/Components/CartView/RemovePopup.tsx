import React from "react";
import { BookItem } from "Types/CartView";

interface RemovePopupProps {
  item: BookItem | null;
  onCancel: () => void;
  onSaveForLater: () => void;
  onRemove: () => void;
}

const RemovePopup: React.FC<RemovePopupProps> = ({
  item,
  onCancel,
  onSaveForLater,
  onRemove,
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-vintageBg rounded-lg p-6 w-11/12 md:w-1/3">
        <div className="flex justify-between gap-2">
          <h3 className="text-vintageText text-lg font-semibold mb-4">
            Remove Book
          </h3>
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
            className="lucide lucide-x-icon lucide-x cursor-pointer text-red-600"
            onClick={onCancel}
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </div>
        <p className="mb-2">{item.title}</p>
        <div className="flex justify-end mt-4">
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-yellow-600 text-light rounded-md"
              onClick={onSaveForLater}
            >
              Save for Later
            </button>
            <button
              className="px-4 py-2 bg-vintageText text-light rounded-md"
              onClick={onRemove}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemovePopup;
