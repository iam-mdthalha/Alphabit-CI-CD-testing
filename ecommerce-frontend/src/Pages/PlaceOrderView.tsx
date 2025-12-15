import { Suspense, lazy } from "react";
import { Templates } from "Enums/Templates";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import type { RootState } from "State/store";
import ErrorTemplate from "Templates/ErrorTemplate/ErrorTemplate";
import CircleLoader from "Components/Common/CircleLoader";

const Template1PlaceOrderView = lazy(
  () => import("Templates/Template1/Pages/PlaceOrderView")
);
const Template2PlaceOrderView = lazy(
  () => import("Templates/Template2/Pages/PlaceOrderView")
);
const Template4PlaceOrderView = lazy(
  () => import("Templates/Template4/Pages/PlaceOrderView")
);

const PlaceOrderView = () => {
  const selectedTemplate = useSelector(
    (state: RootState) => state.template.selected
  );
  const navigate = useNavigate();

  const location = useLocation();
  const { cartItems, selectedCoupon } = location.state || {};

  const handlePaymentSuccess = (orderId: string) => {
    navigate(`/order-placed/${orderId}`);
  };

  const chooseTemplate = (template: Templates) => {
    switch (template) {
      case Templates.TEMP1:
        return <Template1PlaceOrderView />;
      case Templates.TEMP2:
        return <Template2PlaceOrderView />;
      case Templates.TEMP4:
        return (
          <Template4PlaceOrderView
            selectedCoupon={selectedCoupon || null}
            onPaymentSuccess={handlePaymentSuccess}
          />
        );
      default:
        return <ErrorTemplate />;
    }
  };

  return (
    <Suspense fallback={<CircleLoader />}>
      <>{chooseTemplate(selectedTemplate)}</>
    </Suspense>
  );
};

export default PlaceOrderView;
