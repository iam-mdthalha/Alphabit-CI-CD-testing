import { IconBox, IconCheck, IconHome, IconPackage, IconTruck } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLazyTrackAnonymousOrderQuery } from "Services/OrderSummaryApiSlice";

const mockOrder = {
  orderId: "ORD123456789",
  product: "Caviaar Mode Premium Shirt",
  status: 3, // 0: Ordered, 1: Packed, 2: Shipped, 3: Out for Delivery, 4: Delivered
  steps: [
    { label: "Ordered", icon: <IconBox size={24} />, time: "2024-07-15 10:00" },
    { label: "Packed", icon: <IconPackage size={24} />, time: "2024-07-15 14:00" },
    { label: "Shipped", icon: <IconTruck size={24} />, time: "2024-07-16 09:00" },
    { label: "Out for Delivery", icon: <IconHome size={24} />, time: "2024-07-17 08:00" },
    { label: "Delivered", icon: <IconCheck size={24} />, time: null },
  ],
  expectedDelivery: "2024-07-17",
};

const THEME_GREEN = "#228722";
const THEME_BLACK = "#111111";
const THEME_WHITE = "#ffffff";
const THEME_GRAY = "#888888";
const THEME_LIGHT_GRAY = "#f5f5f5";

const TrackOrder: React.FC = () => {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<typeof mockOrder[]>([]);
  const [trackOrder] = useLazyTrackAnonymousOrderQuery();
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const handleTrackOrder = async (orderIdToTrack: string) => {
    setError("");
    setLoading(true);
    setOrders([]);

    try {
      const res = await trackOrder({ orderId: orderIdToTrack }).unwrap();
      const parsedList = res.results.trackShipmentDataResponseList
        .map((str: string) => {
          try {
            return JSON.parse(str);
          } catch (e) {
            console.warn("Failed to parse shipment entry", str);
            return null;
          }
        })
        .filter(Boolean);

      const ordersMapped = parsedList
        .map((entry: any) => {
          const shipment = entry?.ShipmentData?.[0];
          if (!shipment || !shipment.Shipment.Scans || shipment.Shipment.Scans.length === 0) return null;

          const orderId = shipment.Shipment.ReferenceNo || "UNKNOWN_ORDER_ID";
          const product = shipment.Shipment.SenderName || "Your Order";

          const steps: {
            label: string;
            time: string | null;
            instruction: string | null;
          }[] = [];

          shipment.Shipment.Scans.forEach((scanItem: any) => {
            const detail = scanItem?.ScanDetail;

            if (!detail) return; // Skip if ScanDetail is missing

            const label = detail?.Scan || "Update";
            const instruction = detail?.Instructions || null;
            const time = detail?.ScanDateTime
              ? new Date(detail.ScanDateTime).toLocaleString()
              : null;

            // Avoid duplicate labels
            if (!steps.some((s) => s.label === label)) {
              steps.push({ label, time, instruction });
            }
          });

          if (steps.length === 0) return null; // No valid scans

          return {
            orderId,
            product,
            status: steps.length - 1,
            expectedDelivery: shipment.ExpectedDeliveryDate
              ? new Date(shipment.ExpectedDeliveryDate).toLocaleDateString()
              : "N/A",
            steps: steps.map((step) => ({
              ...step,
              icon: <IconCheck size={24} />, // You can customize icons if needed
            })),
          };
        })
        .filter(Boolean);

      if (ordersMapped.length === 0) {
        throw new Error("No shipments found");
      }

      setOrders(ordersMapped);
    } catch (err) {
      console.error("Tracking error", err);
      setError("No valid shipment data found. Please check your Order ID.");
    } finally {
      setLoading(false);
    }
  };

  // Load order from URL only once on component mount
  useEffect(() => {
    const queryOrderId = searchParams.get('orderId');
    if (queryOrderId) {
      setOrderId(queryOrderId);
      handleTrackOrder(queryOrderId);
    }
  }, []); // Empty dependency array - only runs once

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ orderId });
    await handleTrackOrder(orderId);
  };

  const calculateProgress = (status: number, totalSteps: number) => {
    if (totalSteps <= 1) return 100;
    return Math.round((status / (totalSteps - 1)) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-montserrat px-4 py-8 mt-12 mb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-black mb-2 md:mb-4">Track Your Order</h1>
          <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Enter your Order ID to view the latest status of your delivery with real-time updates
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 md:mb-12 max-w-2xl mx-auto">
          <form onSubmit={handleTrack} className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-sm font-semibold text-black mb-2" htmlFor="orderId">
                Order ID
              </label>
              <input
                id="orderId"
                type="text"
                placeholder="e.g. ORD123456789"
                value={orderId}
                onChange={e => setOrderId(e.currentTarget.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-black text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold text-base md:text-lg py-3 px-6 rounded-xl transition-all duration-200 hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Tracking...
                </div>
              ) : (
                "Track Order"
              )}
            </button>
          </form>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-center text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {orders.map((order, orderIdx) => {
          const progressPercent = calculateProgress(order.steps.length, 6);

          return (
            <div key={`${order.orderId}-${orderIdx}`} className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 md:mb-8">
              {/* Order Header */}
              <div className="bg-black text-white p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-300">Order ID</p>
                    <p className="text-sm md:text-lg font-bold">{order.orderId}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-300">Product</p>
                    <p className="text-sm md:text-lg font-bold">{order.product}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-300">Expected Delivery</p>
                    <p className="text-sm md:text-lg font-bold">{order.expectedDelivery}</p>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="p-4 md:p-8">
                {/* Desktop Horizontal */}
                <div className="hidden md:block">
                  <div className="relative">
                    <div className="flex justify-between items-center mb-6 overflow-x-auto scrollbar-hide">
                      {order.steps.map((step, idx) => (
                        <div key={`${step.label}-${idx}`} className="flex flex-col items-center text-center min-w-[5rem]">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${idx <= order.status ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                            }`}>
                            {step.icon}
                          </div>
                          <p className={`font-semibold text-sm mb-1 ${idx <= order.status ? 'text-green-600' : 'text-gray-400'
                            }`}>
                            {step.label.includes("Manifested") ? "Shipped" : step.label}
                          </p>
                          {step.time && (
                            <p className="text-xs text-gray-500 leading-tight">
                              {step.time}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Mobile Vertical */}
                <div className="md:hidden">
                  {order.steps.map((step, idx) => (
                    <div key={`${step.label}-${idx}`} className="flex items-start gap-3 mb-5 last:mb-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx <= order.status ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                        {step.icon}
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${idx <= order.status ? 'text-green-600' : 'text-gray-400'
                          }`}>
                          {step.label}
                        </p>
                        {step.time && (
                          <p className="text-xs text-gray-500 mt-1">{step.time}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gray-50 rounded-xl">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600">Current Status</p>
                      <p className="text-base md:text-lg font-bold text-green-600">
                        {order.steps[order.status]?.label.includes("Manifested") ? "Shipped" : order.steps[order.status]?.label}
                      </p>
                    </div>
                    <div className="md:text-right">
                      <p className="text-xs md:text-sm font-medium text-gray-600">Progress</p>
                      <p className="text-base md:text-lg font-bold text-black">
                        {progressPercent}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackOrder;
