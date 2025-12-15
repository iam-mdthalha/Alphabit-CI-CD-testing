import { Alert } from "@mantine/core";
import { dpis } from "Constants/DPI";
import { ChangeEvent, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Invoice from "Templates/Template4/Components/OrderSummary/Invoice";
// @ts-ignore
import html2pdf from "html2pdf.js";
import ProformaInvoice from "Templates/Template4/Components/OrderSummary/ProformaInvoice";

const InvoicePreview: React.FC = () => {
  const { doNo } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [dpi, setDpi] = useState<string>(Object.keys(dpis)[1]);

  const handleDpiChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDpi(e.target.value);
  };

  const generatePDF = (invoiceType: string) => {
    const element = invoiceRef.current;
    if (!element) return;

    const scale = parseInt(dpi.replace("dpi", ""));

    html2pdf()
      .set({
        margin: 0,
        filename: `${doNo}_invoice_${invoiceType}.pdf`,
        html2canvas: {
          scale: scale / 72,
          useCORS: true,
          // width: parseInt(dpis[dpi].width.replace('px', '')),
          // height: parseInt(dpis[dpi].height.replace('px', ''))
        },
        jsPDF: {
          format: [
            parseInt(dpis[dpi].width.replace("px", "")) + 10,
            parseInt(dpis[dpi].height.replace("px", "")) + 10,
          ],
          unit: "px",
          orientation: "portrait",
        },
        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
        },
      })
      .from(element)
      .save();
  };

  return (
    <div className="min-h-screen bg-vintageBg px-10 md:px-20 lg:px-32 py-12 text-gray-800 tracking-wide font-gilroyRegular">
      <div className="flex flex-col justify-center items-center">
        <div className="border-l-0 lg:border-l-[1px] border-gray-300 max-w-xl">
          <div
            className="flex flex-col mx-4 lg:mx-8 my-8 lg:my-10"
            data-aos="fade-left"
          >
            <div className="flex flex-col space-y-4">
              <h4
                className="text-xl font-bold text-vintageText font-melodramaRegular tracking-wider"
              >
                Download Options
              </h4>

              <div className="space-y-2">
                <label
                  htmlFor="dpi-selector"
                  className="text-sm font-medium text-gray-700 font-gilroyRegular"
                >
                  Choose DPI
                </label>
                <select
                  onChange={handleDpiChange}
                  value={dpi}
                  name="dpiSelector"
                  id="dpi-selector"
                  className="w-full p-3 border border-gray-300 text-vintageText rounded-none focus:ring-2 focus:ring-vintageText focus:border-vintageText font-gilroyRegular transition-colors"
                >
                  {Object.keys(dpis).map((dpi, i) => {
                    return (
                      <option
                        key={`dpi-${i}`}
                        value={dpi}
                        className="font-gilroyRegular"
                      >
                        {dpi}
                      </option>
                    );
                  })}
                </select>
              </div>

              <button
                disabled={
                  searchParams.get("type") != "basic" &&
                  searchParams.get("type") != "proforma"
                }
                onClick={() => {
                  generatePDF(searchParams.get("type") ?? "");
                }}
                className="w-full text-white py-3 px-4 font-gilroyRegular text-sm md:text-lg bg-vintageText hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors tracking-wider"
              >
                Download As PDF
              </button>
            </div>

            <div
              className="mt-8 p-4 rounded-lg border bg-vintageBg border-vintageText"
            >
              <div className="flex items-center space-x-2">
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
                <p
                  className="text-sm text-vintageText font-gilroyRegular"
                >
                  Higher DPI values provide better print quality but larger file
                  sizes.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          {searchParams.get("type") == "basic" ? (
            <Invoice invoiceRef={invoiceRef} doNo={doNo ?? ""} dpi={dpi} />
          ) : searchParams.get("type") == "proforma" ? (
            <ProformaInvoice
              invoiceRef={invoiceRef}
              doNo={doNo ?? ""}
              dpi={dpi}
            />
          ) : (
            <div className="min-h-screen flex items-center justify-center">
              <Alert
                color="yellow"
                title="Invalid Invoice Type"
                className="max-w-md font-gilroyRegular"
              >
                Please select valid invoice type
              </Alert>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
