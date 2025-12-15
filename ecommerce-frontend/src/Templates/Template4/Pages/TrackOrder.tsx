import { IconBox, IconCheck, IconHome, IconPackage, IconTruck } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLazyTrackAnonymousOrderQuery } from "Services/OrderSummaryApiSlice";

const THEME_GREEN = "#326638";
// Main background for all pages (as in BooksListing, ContactUs, etc)
const MAIN_BG = "#f5f2f2ff";
// const MAIN_BG = "#F4DFB4";

const TrackOrder: React.FC = () => {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [trackOrder] = useLazyTrackAnonymousOrderQuery();
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const handleTrackOrder = async (orderIdToTrack: string) => {
    setError("");
    setLoading(true);
    setOrders([]);

    try {
      const sanitized = orderIdToTrack.trim();
      if (!sanitized) {
        throw new Error("Please enter a valid Order ID.");
      }
      const res = await trackOrder({ orderId: sanitized }).unwrap();
      const parsedList = res.results.trackShipmentDataResponseList
        .map((str: string) => {
          try {
            return JSON.parse(str);
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      const ordersMapped = parsedList
        .map((entry: any) => {
          const shipment = entry?.ShipmentData?.[0];
          if (!shipment?.Shipment?.Scans?.length) return null;

          const steps = shipment.Shipment.Scans.map((scanItem: any) => {
            const detail = scanItem?.ScanDetail;
            if (!detail) return null;
            return {
              label: detail.Scan || "Update",
              time: detail.ScanDateTime
                ? new Date(detail.ScanDateTime).toLocaleString()
                : null,
              icon: <IconCheck size={22} />,
            };
          }).filter(Boolean);

          return {
            orderId: shipment.Shipment.ReferenceNo || "UNKNOWN_ORDER_ID",
            product: shipment.Shipment.SenderName || "Your Order",
            status: steps.length - 1,
            expectedDelivery: shipment.ExpectedDeliveryDate
              ? new Date(shipment.ExpectedDeliveryDate).toLocaleDateString()
              : "N/A",
            steps,
          };
        })
        .filter(Boolean);

      if (!ordersMapped.length) throw new Error("No shipments found");

      setOrders(ordersMapped);
    } catch (err) {
      console.error("Tracking error", err);
      setError(
        err instanceof Error && err.message
          ? err.message
          : "No valid shipment data found. Please check your Order ID."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryOrderId = searchParams.get("orderId");
    if (queryOrderId) {
      setOrderId(queryOrderId);
    }
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = orderId.trim();
    if (!sanitized) {
      setError("Please enter a valid Order ID.");
      return;
    }
    setSearchParams({ orderId: sanitized });
    await handleTrackOrder(sanitized);
  };

  const calculateProgress = (status: number, totalSteps: number) =>
    totalSteps <= 1 ? 100 : Math.round((status / (totalSteps - 1)) * 100);

  return (
    <div
      className="min-h-screen bg-vintageBg font-gilroyRegular py-3 md:py-12 px-6 lg:px-24"
      data-aos="fade-up"
      style={{ backgroundColor: MAIN_BG }}
    >
      <div className="max-w-5xl mx-auto mt-20">
        <div className="text-center mb-8 md:mb-12">
          <h1
            className="text-3xl md:text-4xl font-bold text-vintageText capitalize tracking-wider font-melodramaRegular mb-3"
            style={{ color: THEME_GREEN }}
          >
            Track Your Order
          </h1>
          <p className="text-gray-800 max-w-2xl mx-auto leading-relaxed">
            Enter your Order ID to view the latest status of your delivery with real-time updates.
          </p>
        </div>

        <form
          onSubmit={handleTrack}
          className="max-w-xl mx-auto mb-4 md:mb-8 flex flex-col md:flex-row gap-4"
        >
          <input
            id="orderId"
            type="text"
            placeholder="e.g. ORD123456789"
            value={orderId}
            onChange={(e) => setOrderId(e.currentTarget.value)}
            required
            className="flex-1 px-4 py-3 rounded-xl border border-gray-500 border-opacity-50 text-black text-base focus:outline-none focus:ring-1 transition-all duration-200 bg-transparent placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: THEME_GREEN, color: "white" }}
          >
            {loading ? "Tracking..." : "Track"}
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-center mb-8 font-medium">{error}</p>
        )}

        {orders.map((order, orderIdx) => {
          const progressPercent = calculateProgress(order.status, order.steps.length);

          return (
            <div
              key={`${order.orderId}-${orderIdx}`}
              className="rounded-2xl p-6 mb-10 border border-green-300"
              style={{ backgroundColor: "#fdfcf7" }}
            >
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-bold text-lg">{order.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Product</p>
                  <p className="font-bold text-lg">{order.product}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expected Delivery</p>
                  <p className="font-bold text-lg">{order.expectedDelivery}</p>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="flex justify-between items-start relative">
                  {order.steps.map((step: any, idx: number) => (
                    <div key={`${step.label}-${idx}`} className="flex flex-col items-center text-center min-w-[5rem]">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          idx <= order.status ? "bg-green-600 text-white" : "bg-gray-300 text-gray-500"
                        }`}
                      >
                        {step.icon}
                      </div>
                      <p
                        className={`font-semibold text-sm ${
                          idx <= order.status ? "text-green-700" : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </p>
                      {step.time && <p className="text-xs text-gray-600 mt-1">{step.time}</p>}
                    </div>
                  ))}
                  <div className="absolute top-6 left-0 w-full h-1 bg-gray-300 -z-10">
                    <div
                      className="h-1 bg-green-600 transition-all duration-700 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="md:hidden space-y-5">
                {order.steps.map((step: any, idx: number) => (
                  <div key={`${step.label}-${idx}`} className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        idx <= order.status ? "bg-green-600 text-white" : "bg-gray-300 text-gray-500"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <p
                        className={`font-semibold text-sm ${
                          idx <= order.status ? "text-green-700" : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </p>
                      {step.time && <p className="text-xs text-gray-600">{step.time}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackOrder;
