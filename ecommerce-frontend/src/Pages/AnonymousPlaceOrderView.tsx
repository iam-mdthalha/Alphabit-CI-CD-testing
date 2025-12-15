import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "State/store";
import CircleLoader from "Components/Common/CircleLoader";

const Template1AnonymousPlaceOrderView = lazy(
  () => import("Templates/Template1/Pages/AnonymousPlaceOrderView")
);
const Template2AnonymousPlaceOrderView = lazy(
  () => import("Templates/Template2/Pages/AnonymousPlaceOrderView")
);

const AnonymousPlaceOrderView = () => {
  const selectedTemplate = useSelector(
    (state: RootState) => state.template.selected
  );

  return (
    <Suspense fallback={<CircleLoader />}>
      {selectedTemplate === "template1" ? (
        <Template1AnonymousPlaceOrderView />
      ) : (
        <Template2AnonymousPlaceOrderView />
      )}
    </Suspense>
  );
};

export default AnonymousPlaceOrderView;
