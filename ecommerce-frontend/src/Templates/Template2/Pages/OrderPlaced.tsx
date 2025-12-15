import { RootState } from "State/store";
import { FaCheckCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const OrderPlaced = () => {
  const { userInfo, token } = useSelector((state: RootState) => state.login);

  const { orderId } = useParams();
  
  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center font-montserrat tracking-widest bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow text-center w-[90vw] md:w-[50vw] flex flex-col justify-center items-center">
        <FaCheckCircle className="text-green-500 text-6xl mb-4" />
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Order Placed Successfully
        </h1>
        <h3 className="text-xl font-medium text-gray-800 mb-4">
          Order Id <span className="font-semibold text-gray-900">{orderId}</span>
        </h3>
        <p className="text-gray-600 text-lg mb-6">
          Hi {userInfo?.fullName || ""}, Thanks for placing your order with us. If you have any queries, feel free to
          get in touch with us at {" "}
          <a href="mailto:info@caviaarmode.com" className="underline">info@caviaarmode.com</a>
        </p>
      </div>
    </div>
  );
};

export default OrderPlaced;
