import { Alert } from "@mantine/core";
import { dpis } from "Constants/DPI";
import { ChangeEvent, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Invoice from "../Components/OrderSummary/Invoice";
// @ts-ignore
import html2pdf from 'html2pdf.js';
import ProformaInvoice from "../Components/OrderSummary/ProformaInvoice";

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
        if(!element) return;

        const scale = parseInt(dpi.replace('dpi', ''));


        html2pdf().set({
            margin: 0,
            filename: `${doNo}_invoice_${invoiceType}.pdf`,
            html2canvas: {
                scale: scale / 72,
                useCORS: true,
                // width: parseInt(dpis[dpi].width.replace('px', '')),
                // height: parseInt(dpis[dpi].height.replace('px', ''))
            },
            jsPDF: {
                format: [parseInt(dpis[dpi].width.replace('px', '')) + 10, parseInt(dpis[dpi].height.replace('px', '')) + 10],
                unit: 'px',
                orientation: 'portrait'
            },
            pagebreak: {
                mode: ['avoid-all', 'css', 'legacy']
            }
        })
            .from(element)
            .save();
        
    }

    return (
        <div className="my-5">
            <div className="grid grid-cols-3">
                <div className="col-span-2">
                    {
                       searchParams.get("type") == "basic" ?
                                <Invoice invoiceRef={invoiceRef} doNo={doNo ?? ''} dpi={dpi} />
                            :
                            searchParams.get("type") == "proforma" ?
                                <ProformaInvoice invoiceRef={invoiceRef} doNo={doNo ?? ''} dpi={dpi} />
                            :
                            <div className="min-h-screen flex items-center justify-center">
                                <Alert color="yellow" title="Invalid Invoice Type" className="max-w-md">
                                    Please select valid invoice type
                                </Alert>
                            </div>
                            
                    }

                </div>
                <div className="border-l-[1px] border-[#ddd] max-w-xl">
                    <div className="flex flex-col mx-16 my-10">
                        <div className="flex flex-col space-y-3">
                            <h4 className="text-lg font-semibold">Choose DPI</h4>
                            
                            <select onChange={handleDpiChange} value={dpi} name="dpiSelector" id="dpi-selector">
                                {
                                    Object.keys(dpis).map((dpi, i) => {
                                        return <option key={`dpi-${i}`} value={dpi}>{dpi}</option>
                                    })
                                }
                            </select>
                            <button
                                disabled={searchParams.get("type") != "basic" && searchParams.get("type") != "proforma"}
                                onClick={() => {
                                    generatePDF(searchParams.get("type") ?? '')
                                
                                }}
                                className="w-full bg-black text-white py-2 px-4 hover:bg-gray-800 disabled:bg-gray-400"
                            >
                                Download As PDF
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default InvoicePreview;