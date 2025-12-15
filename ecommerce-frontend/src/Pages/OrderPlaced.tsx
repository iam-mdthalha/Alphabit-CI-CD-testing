import { Suspense, lazy } from "react";
import { Templates } from "Enums/Templates";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "State/store";
import ErrorTemplate from "Templates/ErrorTemplate/ErrorTemplate";
import CircleLoader from "Components/Common/CircleLoader";

const Template1OrderPlaced = lazy(
  () => import("Templates/Template1/Pages/OrderPlaced")
);
const Template2OrderPlaced = lazy(
  () => import("Templates/Template2/Pages/OrderPlaced")
);
const Template4OrderPlaced = lazy(
  () => import("Templates/Template4/Pages/OrderPlaced")
);

const OrderPlaced = () => {
  const selectedTemplate = useSelector(
    (state: RootState) => state.template.selected
  );
  const navigate = useNavigate();

  const chooseTemplate = (template: Templates) => {
    switch (template) {
      case Templates.TEMP1:
        return <Template1OrderPlaced />;
      case Templates.TEMP2:
        return <Template2OrderPlaced />;
      case Templates.TEMP4:
        return <Template4OrderPlaced />;
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

export default OrderPlaced;
