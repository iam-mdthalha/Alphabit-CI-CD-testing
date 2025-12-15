import { Templates } from "Enums/Templates";
import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "State/store";
import ErrorTemplate from "Templates/ErrorTemplate/ErrorTemplate";
import CircleLoader from "Components/Common/CircleLoader";

const Template1ProductDetailView = lazy(
  () => import("Templates/Template1/Pages/ProductDetailView")
);
const Template2ProductDetailView = lazy(
  () => import("Templates/Template2/Pages/ProductDetailView")
);
const Template3ProductDetailView = lazy(
  () => import("Templates/Template3/Pages/ProductDetailView")
);
const Template4ProductDetailView = lazy(
  () => import("Templates/Template4/Pages/ProductDetailView")
);

const ProductDetailView = () => {
  const selectedTemplate = useSelector(
    (state: RootState) => state.template.selected
  );

  const chooseTemplate = (templates: Templates) => {
    switch (templates) {
      case Templates.TEMP1:
        return <Template1ProductDetailView />;
      case Templates.TEMP2:
        return <Template2ProductDetailView />;
      case Templates.TEMP3:
        return <Template3ProductDetailView />;
      case Templates.TEMP4:
        return <Template4ProductDetailView />;
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

export default ProductDetailView;
