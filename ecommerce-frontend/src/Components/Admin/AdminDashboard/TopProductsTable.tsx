import type React from "react";
import { useGetAllTopSellingQuery } from "Services/Admin/DashboardApiSlice";

export const TopProductsTable: React.FC = () => {
  const plant = process.env.REACT_APP_PLANT;
  const {
    data: products,
    isLoading,
    error,
  } = useGetAllTopSellingQuery({ plant });


  // If products is not an array, try to convert it
  const productsArray = Array.isArray(products)
    ? products
    : typeof products === "object"
    ? Object.values(products)
    : [];

  // Parse each product if it's a JSON string
  const parsedProducts = productsArray.map((product: any) => {
    if (typeof product === "string") {
      try {
        return JSON.parse(product);
      } catch {
        return product;
      }
    }
    return product;
  });

  const firstFiveProducts = parsedProducts.slice(0, 5);

  return (
    <div className="font-gilroyRegular tracking-wider bg-white p-5 rounded-lg border shadow-sm">
      <h2 className="text-base font-medium mb-4">Top Products by Units Sold</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : error || !products || (Array.isArray(products) && products.length === 0) ? (
        <div className="text-gray-500 mb-2">No data available.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-medium text-xs">
                  Product
                </th>
                <th className="text-left py-3 px-2 font-medium text-xs">Price</th>
                <th className="text-left py-3 px-2 font-medium text-xs">
                  Units Sold
                </th>
              </tr>
            </thead>
            <tbody>
              {firstFiveProducts.map((product: any, index: number) => (
                <tr key={product.item || index} className="border-b">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md overflow-hidden">
                        {/* No image in data, so use placeholder */}
                        <img
                          src={"/placeholder.svg"}
                          alt={product.itemDescription || "Product"}
                          className="w-full h-full object-cover text-sm"
                          width="auto"
                          height="auto"
                        />
                      </div>
                      <span className="font-medium text-sm">
                        {product.itemDescription || "Product"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm">
                    {product.ecomUnitPrice !== undefined ? product.ecomUnitPrice.toFixed(0) : "-"}
                  </td>
                  <td className="py-3 px-2 text-sm">
                    {product.quantityOrdered !== undefined
                      ? product.quantityOrdered
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
