import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";

type Props = {
  value: number;
  productQuantity: number;
  increaseQuantity: () => void;
  decreaseQuantity: () => void;
};

const QuantitySelector = ({
  value,
  productQuantity,
  increaseQuantity,
  decreaseQuantity,
}: Props) => {
  const [localValue, setLocalValue] = useState(value);
  const [availableQuantity, setAvailableQuantity] = useState(productQuantity);

  // Sync local state with parent props
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    setAvailableQuantity(productQuantity);
  }, [productQuantity]);

  const handleIncrement = () => {
    const newValue = localValue + 1;
    if (newValue > availableQuantity) {
      notifications.show({
        title: "Out of Stock",
        message: "You've reached the maximum available quantity",
        color: "yellow",
        autoClose: 3000,
      });
      return;
    }
    setLocalValue(newValue);
    increaseQuantity();
  };

  const handleDecrement = () => {
    if (localValue > 1) {
      setLocalValue(localValue - 1);
      decreaseQuantity();
    }
  };

  return (
    <div className="relative flex items-center max-w-[9rem]">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={localValue <= 1}
        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-9 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          className="w-3 h-3 text-gray-900 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 2"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1h16"
          />
        </svg>
      </button>
      <input
        type="text"
        value={localValue}
        readOnly
        aria-describedby="helper-text-explanation"
        className="bg-gray-50 border-x-0 border-gray-300 h-9 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-12 py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={localValue >= availableQuantity}
        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-9 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          className="w-3 h-3 text-gray-900 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 18"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 1v16M1 9h16"
          />
        </svg>
      </button>
    </div>
  );
};

export default QuantitySelector;
