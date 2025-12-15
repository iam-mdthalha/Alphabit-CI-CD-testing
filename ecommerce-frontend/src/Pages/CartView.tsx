import { Suspense, lazy } from "react";
import { Templates } from "Enums/Templates";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "State/store";
import ErrorTemplate from "Templates/ErrorTemplate/ErrorTemplate";
import CircleLoader from "Components/Common/CircleLoader";

const Template1CartView = lazy(
  () => import("Templates/Template1/Pages/CartView")
);
const Template2CartView = lazy(
  () => import("Templates/Template2/Pages/CartView")
);
const Template4CartView = lazy(
  () => import("Templates/Template4/Pages/CartView")
);

const CartView = () => {
  const selectedTemplate = useSelector(
    (state: RootState) => state.template.selected
  );
  const navigate = useNavigate();

  const chooseTemplate = (template: Templates) => {
    switch (template) {
      case Templates.TEMP2:
        return <Template2CartView />;
      case Templates.TEMP4:
        return <Template4CartView />;
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

export default CartView;
