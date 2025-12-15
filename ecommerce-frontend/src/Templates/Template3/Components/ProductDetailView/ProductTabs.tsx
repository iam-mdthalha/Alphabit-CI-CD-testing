import { useState } from "react";

// export default function ProductTabs({ tabs }: any) {
//     const [activeTab, setActiveTab] = useState("Description");

//     return (
//         <div className="px-6 py-4">
//             <div className="flex space-x-4 border-b">
//                 {Object.keys(["Description", "Shipping & Returns", "Care Instructions"]).map(tab => (
//                     <button
//                         key={tab}
//                         onClick={() => setActiveTab(tab)}
//                         className={`py-2 ${activeTab === tab ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
//                     >
//                         {tab}
//                     </button>
//                 ))}
//             </div>
//             <div className="mt-4 text-gray-700 whitespace-pre-line">{tabs[activeTab]}</div>
//         </div>
//     );
// }

export default function ProductTabs({ description, shippingAndReturns, careInstructions }: { description: string[], shippingAndReturns: string, careInstructions: string }) {
    const [activeTab, setActiveTab] = useState("description");

    return (
        <div className="px-6 py-4">
            <div className="flex justify-center space-x-4 border-b">
                
                    <button
                        onClick={() => setActiveTab("description")}
                    className={`py-2 ${activeTab === "description" ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
                    >
                        Description
                    </button>
                    <button
                        onClick={() => setActiveTab("shipping-and-returns")}
                    className={`py-2 ${activeTab === "shipping-and-returns" ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
                    >
                        Shipping And Returns
                    </button>
                    <button
                        onClick={() => setActiveTab("care-instructions")}
                        className={`py-2 ${activeTab === "care-instructions" ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
                    >
                        Care Instructions
                    </button>
            </div>
            <div className="mt-4 text-gray-700 whitespace-pre-line">
                { 
                activeTab === "description" ? description : activeTab === "shipping-and-returns" ? shippingAndReturns : activeTab === "care-instructions" ? careInstructions : "Invalid Tab" }</div>
        </div>
    );
}