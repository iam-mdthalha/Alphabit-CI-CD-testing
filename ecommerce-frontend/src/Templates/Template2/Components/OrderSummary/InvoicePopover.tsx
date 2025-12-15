import { useEffect, useRef, useState } from "react";

type InvoicePopoverProps = {
    generateInvoice: () => void;
    generateProformaInvoice: () => void;
    isProformaInvoiceAvailable: boolean;
    isInvoiceAvailable: boolean;
}

const InvoicePopover: React.FC<InvoicePopoverProps> = ({generateInvoice, generateProformaInvoice, isProformaInvoiceAvailable, isInvoiceAvailable }) => {
    const [open, setOpen]= useState<boolean>(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    
    // const { data: isProformaInvoiceAvailable, isLoading: isProformaInvoiceAvailableLoading, error: isProformaInvoiceAvailableError } = useCheckProformaInvoiceAvailableQuery({ doNo: doNo });

    // const { data: isInvoiceAvailable, isLoading: isInvoiceAvailableLoading, error: isInvoiceAvailableError } = useCheckInvoiceAvailableQuery({ doNo: doNo });


    useEffect(() => {
        const handleClickOutside = (e: any) => {
            if(popoverRef.current && !popoverRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={popoverRef}>
            <button
                onClick={() => setOpen(!open)}
                className="text-blue-600 hover:text-blue-800 text-sm flex gap-1 items-center"
            >
                <span>Invoice</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
            </button>
            {open && (
                <div className="absolute z-10 mt-2 w-64 bg-white border rounded-md shadow-lg p-3">
                    <div className="mx-5">
                        <ul className=" list-decimal">
                                {
                                    isProformaInvoiceAvailable &&
                                    <li>
                                        <button
                                            onClick={generateProformaInvoice}
                                            className="text-blue-600 hover:text-blue-800 text-sm flex gap-1 items-center"
                                        >
                                            <span>Proforma Invoice</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="7 10 12 15 17 10" />
                                                <line x1="12" y1="15" x2="12" y2="3" />
                                            </svg>
                                        </button>
                                    </li>
                                        
                                }
                                {
                                    isInvoiceAvailable &&
                                    <li>
                                        <button
                                            onClick={generateInvoice}
                                            className="text-blue-600 hover:text-blue-800 text-sm flex gap-1 items-center"
                                        >
                                            <span>Invoice</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="7 10 12 15 17 10" />
                                                <line x1="12" y1="15" x2="12" y2="3" />
                                            </svg>
                                        </button>
                                    </li>
                                    
                                }
                                
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InvoicePopover;