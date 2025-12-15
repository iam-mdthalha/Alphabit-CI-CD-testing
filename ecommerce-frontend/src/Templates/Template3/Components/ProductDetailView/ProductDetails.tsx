import { ProductMetaDTO } from "Types/ProductMetaDTO";

type ProductDetailsProps = {
    product: ProductMetaDTO
}

export default function ProductDetails({product}: ProductDetailsProps) {

    const handleWhatsappEnquiry = ({name , price}: {name: string, price: number}) => {
        const message = `Hi, I'm interested in this product:\n\n*${name}*\nPrice: ₹${price}\n\nPlease share more details.`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappNumber = "+918668050644";
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(whatsappURL, "_blank");
    };

    return (
        <div className="p-6 space-y-4 max-w-lg">
            <h1 className="text-2xl font-semibold">{product.product.itemDesc}</h1>
            <p className="text-xl text-gray-800">₹{product.product.sellingPrice.toFixed(2)}</p>
            {/* <div>
                <span className="font-medium">SIZE:</span>
                <div className="grid grid-cols-6 gap-2 mt-2">
                    {product.sizes.map((size: any) => (
                        <button key={size} className="border px-3 py-1 hover:bg-gray-200">{size}</button>
                    ))}
                </div>
            </div>
            <div>
                <span className="font-medium">WIDTH:</span>
                <div className="flex gap-2 mt-2">
                    <button className="border px-3 py-1 hover:bg-gray-200">D</button>
                    <button className="border px-3 py-1 hover:bg-gray-200">E</button>
                </div>
            </div> */}

            <button
                onClick={() =>
                    handleWhatsappEnquiry({
                        name: product.product.itemDesc,
                        price: product.product.sellingPrice,
                    })
                }
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out text-center"
            >
                Enquiry in whatsapp
            </button>
        </div>
    );
}
