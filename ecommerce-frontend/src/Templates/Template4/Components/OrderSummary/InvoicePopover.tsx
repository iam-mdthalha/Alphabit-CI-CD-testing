import { useEffect, useRef, useState } from "react";

type InvoicePopoverProps = {
  generateInvoice: () => void;
  generateProformaInvoice: () => void;
  isProformaInvoiceAvailable: boolean;
  isInvoiceAvailable: boolean;
};

const InvoicePopover: React.FC<InvoicePopoverProps> = ({
  generateInvoice,
  generateProformaInvoice,
  isProformaInvoiceAvailable,
  isInvoiceAvailable,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative inline-block text-left font-gilroyRegular"
      ref={popoverRef}
    >
      <button
        onClick={() => setOpen(!open)}
        className="text-vintageText hover:text-green-700 text-sm flex gap-1 items-center transition-colors tracking-wider"
        style={{ color: "#326638" }}
        data-aos="fade-left"
      >
        <span>Invoice</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute z-10 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 font-gilroyRegular transition-all duration-300"
          style={{ borderColor: "#326638" }}
          data-aos="fade-down"
        >
          <div className="space-y-3">
            {isProformaInvoiceAvailable && (
              <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: "#326638" }}
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <button
                  onClick={() => {
                    generateProformaInvoice();
                    setOpen(false);
                  }}
                  className="text-vintageText hover:text-green-700 text-sm flex-1 text-left transition-colors"
                  style={{ color: "#326638" }}
                >
                  Proforma Invoice
                </button>
              </div>
            )}

            {isInvoiceAvailable && (
              <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: "#326638" }}
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <button
                  onClick={() => {
                    generateInvoice();
                    setOpen(false);
                  }}
                  className="text-vintageText hover:text-green-700 text-sm flex-1 text-left transition-colors"
                  style={{ color: "#326638" }}
                >
                  Tax Invoice
                </button>
              </div>
            )}

            {!isProformaInvoiceAvailable && !isInvoiceAvailable && (
              <div className="text-center py-2">
                <p className="text-sm text-gray-500">No invoices available</p>
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Download your order documents
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicePopover;
