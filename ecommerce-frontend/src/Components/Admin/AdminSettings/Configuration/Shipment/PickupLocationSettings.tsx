import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { PickupLocationSettingDTO } from "Interface/Admin/Configuration/shipment-config.interface";
import { useState } from "react";
import { useGetAllLocTypesQuery } from "Services/Admin/LocTypeApiSlice";
import { useGetPickupLocationsQuery, useSavePickupLocationMutation } from "Services/Admin/ShipmentConfigApiSlice";
import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";


const PickupLocationSettings = () => {
    const [onAdd, setOnAdd] = useState<boolean>(false); 
    const plant = process.env.REACT_APP_PLANT;

    const [formData, setFormData] = useState<PickupLocationSettingDTO>({
        warehouseName: "",
        warehouseType: "",
        mobileNumber: "",
        email: "",
        address: "",
        pinCode: "",
        city: "",
        state: "",
        country: "",
        returnAddress: "",
        returnPinCode: "",
        returnCity: "",
        returnState: "",
        returnCountry: "",
        active: true
    });
    

    const { data: locTypes = [], isLoading } = useGetAllLocTypesQuery({
        plant: plant,
    });

    const { data: pickupLocations, isLoading: pickupLocationsLoading } = useGetPickupLocationsQuery();
 
    const [savePickupLocation] = useSavePickupLocationMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
             const createPayload = {
                ...formData
            };
    
            await savePickupLocation(createPayload).unwrap();
    
            notifications.show({
                title: "Success",
                message: "Payment configuration created successfully!",
                color: "green",
                icon: <IconCheck size={18} />,
            });
        } catch(err) {
            console.error(err);
        }
  
      };
    
      if (isLoading) return <div className="w-full h-screen justify-center items-center"><CircleLoader /></div>;

    return (
        <div className="font-gilroyRegular tracking-wider bg-white p-4 rounded-md border border-gray-200 space-y-5">
            <div className="flex justify-between items-center">
                <p className="block text-xs font-medium text-gray-700 mb-1">
                    Pickup Location Settings
                </p>
                <div>
                    {
                        onAdd ?
                        <button
                            type="button"
                            onClick={() => setOnAdd(false)}
                            className="text-xs font-medium bg-gray-600 ml-auto text-white px-6 py-2 rounded hover:bg-gray-700"
                        >
                            Back
                        </button>
                        :
                        <button
                            type="button"
                            onClick={() => setOnAdd(true)}
                            className="text-xs font-medium bg-blue-600 ml-auto text-white px-6 py-2 rounded hover:bg-blue-700"
                        >
                            Add Pickup Location
                        </button>
                    }
                   
                </div>
            </div>
            {
                onAdd ? 
                <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label htmlFor="warehouse-name" className="block text-xs font-medium text-gray-700 mb-1">
                                    Warehouse Name
                                </label>
                                {/* isLowStockThreshold */}
                                <input
                                    id="warehouse-name"
                                    type="text"
                                    // value={formData.warehouseName}
                                    onChange={handleChange}
                                    className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="warehouse-type"
                                    className="block text-xs font-medium text-gray-700 mb-1"
                                >
                                    Warehouse Type
                                </label>
                                <select
                                    id="warehouse-type"
                                    // value={formData.warehouseType}
                                    onChange={handleChange}
                                    className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    disabled={isLoading}
                                >
                                    <option value="">Select a location</option>
                                    {locTypes.map((locType) => (
                                        <option key={locType.locTypeId} value={locType.locTypeId}>
                                            {locType.locTypeDesc}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="mobile-number" className="block text-xs font-medium text-gray-700 mb-1">
                                    Mobile Number
                                </label>
                                {/* isLowStockThreshold */}
                                <input
                                    id="mobile-number"
                                    type="text"
                                    // value={formData.mobileNumber}
                                    onChange={handleChange}
                                    className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                {/* isLowStockThreshold */}
                                <input
                                    id="email"
                                    type="text"
                                    // value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="col-span-2">
                                <label htmlFor="address" className="block text-xs font-medium text-gray-700 mb-1">
                                    Address
                                </label>
                                {/* isLowStockThreshold */}
                                <input
                                    id="address"
                                    type="text"
                                    // value={formData.address}
                                    onChange={handleChange}
                                    className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="pincode" className="block text-xs font-medium text-gray-700 mb-1">
                                    Pin Code
                                </label>
                                {/* isLowStockThreshold */}
                                <input
                                    id="pincode"
                                    type="text"
                                    // value={formData.pinCode}
                                    onChange={handleChange}
                                    className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="city" className="block text-xs font-medium text-gray-700 mb-1">
                                    City
                                </label>
                                {/* isLowStockThreshold */}
                                <input
                                    id="city"
                                    type="text"
                                    // value={formData.city}
                                    onChange={handleChange}
                                    className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="state" className="block text-xs font-medium text-gray-700 mb-1">
                                    State
                                </label>
                                {/* isLowStockThreshold */}
                                <input
                                    id="state"
                                    type="text"
                                    // value={formData.state}
                                    onChange={handleChange}
                                    className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="country" className="block text-xs font-medium text-gray-700 mb-1">
                                    Country
                                </label>
                                {/* isLowStockThreshold */}
                                <input
                                    id="country"
                                    type="text"
                                    // value={formData.country}
                                    onChange={handleChange}
                                    className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="col-span-2">
                                <label htmlFor="return-address" className="block text-xs font-medium text-gray-700 mb-1">
                                    Return Address
                                </label>
                                {/* isLowStockThreshold */}
                                <input
                                    id="return-address"
                                    type="text"
                                    // value={formData.returnAddress}
                                    onChange={handleChange}
                                    className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="return-pincode" className="block text-xs font-medium text-gray-700 mb-1">
                                    Return Pin Code
                                </label>
                                {/* isLowStockThreshold */}
                                <input
                                    id="return-pincode"
                                    type="text"
                                    // value={formData.returnPinCode}
                                    onChange={handleChange}
                                    className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="return-city" className="block text-xs font-medium text-gray-700 mb-1">
                                    Return City
                                </label>
                                {/* isLowStockThreshold */}
                                <input
                                    id="return-city"
                                    type="text"
                                    // value={formData.returnCity}
                                    onChange={handleChange}
                                    className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="return-state" className="block text-xs font-medium text-gray-700 mb-1">
                                    Return State
                                </label>
                                {/* isLowStockThreshold */}
                                <input
                                    id="return-state"
                                    type="text"
                                    // value={formData.returnState}
                                    onChange={handleChange}
                                    className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="return-country" className="block text-xs font-medium text-gray-700 mb-1">
                                    Return Country
                                </label>
                                {/* isLowStockThreshold */}
                                <input
                                    id="return-country"
                                    type="text"
                                    // value={formData.returnCountry}
                                    onChange={handleChange}
                                    className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-self-center mt-5">
                            <button
                                type="submit"
                                className="text-xs font-medium bg-blue-600 ml-auto text-white px-6 py-2 rounded hover:bg-blue-700"
                            >
                                Create
                            </button>
                        </div>
                </form>
                :
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Pickup Location
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Address
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    City
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                pickupLocations?.map((data: PickupLocationSettingDTO) => {
                                    return (
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {data.warehouseName}
                                            </th>
                                            <td className="px-6 py-4">
                                                {data.address}
                                            </td>
                                            <td className="px-6 py-4">
                                                {
                                                    data.active == true ? 
                                                        <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300">Active</span>
                                                    :
                                                        <span className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300">InActive</span>
                                                }
                                            </td>
                                            <td className="px-6 py-4">
                                                {data.city}
                                            </td>
                                        </tr>
                                    );
                                })
                                 }
                        </tbody>
                    </table>
                </div>
            }
            
        </div>
    );
}

export default PickupLocationSettings;

function dispatch(arg0: any) {
    throw new Error("Function not implemented.");
}
