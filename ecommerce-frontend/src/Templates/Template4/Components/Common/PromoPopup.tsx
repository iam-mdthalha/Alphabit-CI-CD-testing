import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllBannersWithoutBytesQuery } from "Services/Admin/BannerApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "State/store";

const PROMO_POPUP_DELAY = 3500;
const SESSION_STORAGE_KEY = "promo_popup_shown";

const PromoPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { token } = useSelector((state: RootState) => state.login);
  const { isLoggedIn } = useSelector((state: RootState) => state.stateevents);

  const { data: apiBanners, isLoading: bannerLoading } =
    useGetAllBannersWithoutBytesQuery();
  const banners: any[] = apiBanners?.results || [];
  const currentBanner = banners[0];

  const isUserLoggedIn = !!(token && isLoggedIn);

  const hasPopupBeenShown = () => {
    return sessionStorage.getItem(SESSION_STORAGE_KEY) === "true";
  };

  const markPopupAsShown = () => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
  };

  useEffect(() => {
    if (isUserLoggedIn || hasPopupBeenShown()) {
      setShouldRender(false);
      return;
    }

    setShouldRender(true);

    const timer = setTimeout(() => {
      setOpen(true);
      markPopupAsShown();
    }, PROMO_POPUP_DELAY);

    return () => clearTimeout(timer);
  }, [isUserLoggedIn]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();

      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || !modalRef.current) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    setTimeout(() => modalRef.current?.focus(), 100);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  function closeModal() {
    setOpen(false);
  }

  if (!shouldRender || isUserLoggedIn) return null;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-vintageBg bg-opacity-50 transition-opacity animate-fade-in p-4"
      aria-modal="true"
      tabIndex={-1}
      role="dialog"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-vintageBg rounded-2xl shadow-2xl flex flex-col animate-slide-up text-vintageBg font-gilroyRegular tracking-wider leading-wider"
        style={{ outline: "none" }}
      >
        <button
          aria-label="Close"
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 h-4 w-4 flex justify-center items-center text-vintageText bg-vintageBg hover:bg-yellow-500 hover:text-vintageBg rounded-full text-2xl focus:outline-none"
        >
          &times;
        </button>

        <div className="w-full flex-shrink-0">
          {bannerLoading ? (
            <div className="w-full h-64 bg-gray-200 animate-pulse rounded-t-2xl"></div>
          ) : currentBanner?.bannerPath ? (
            <img
              src={currentBanner.bannerPath}
              alt={currentBanner.title || "Promo Banner"}
              className="w-full h-64 object-cover rounded-t-2xl"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.jpg";
              }}
            />
          ) : (
            <div className="w-full h-64 bg-gray-300 rounded-t-2xl flex items-center justify-center">
              <span className="text-gray-500 text-sm">Promo Image</span>
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col items-center text-center space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold font-melodramaRegular text-vintageText">
              Join Moore Market!
            </h2>
            <p className="text-sm leading-relaxed text-gray-800">
              Sign up today and{" "}
              <span className="font-bold text-yellowBg">
                earn 5 loyalty points
              </span>{" "}
              on your purchase. Enjoy exclusive member benefits!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              type="button"
              className="flex-1 bg-vintageText hover:bg-opacity-90 text-vintageBg font-semibold rounded-lg px-6 py-3 transition shadow-md focus:outline-none focus:ring-2 focus:ring-green-400"
              onClick={() => {
                closeModal();
                navigate("/register");
              }}
            >
              Register
            </button>
            <button
              type="button"
              className="flex-1 bg-yellow-500 hover:bg-opacity-90 text-vintageBg font-semibold rounded-lg px-6 py-3 transition shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => {
                closeModal();
                navigate("/login");
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease; }
        @keyframes slide-up { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.35s cubic-bezier(.28,.84,.42,1); }
      `}</style>
    </div>
  );
};

export default PromoPopup;
