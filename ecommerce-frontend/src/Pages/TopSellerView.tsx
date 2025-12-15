import { Templates } from "Enums/Templates";
import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "State/store";
import ErrorTemplate from "Templates/ErrorTemplate/ErrorTemplate";
import CircleLoader from "Components/Common/CircleLoader";

const Template1TopSellerView = lazy(
  () => import("Templates/Template1/Pages/TopSellerView")
);
const Template2TopSellerView = lazy(
  () => import("Templates/Template2/Pages/TopSellerView")
);
const Template3TopSellerView = lazy(
  () => import("Templates/Template3/Pages/TopSellerView")
);
const Template4TopSellerView = lazy(
  () => import("Templates/Template4/Pages/TopSellerView")
);

const TopSellerView = () => {
  const selectedTemplate = useSelector(
    (state: RootState) => state.template.selected
  );

  const chooseTemplate = (template: Templates) => {
    switch (template) {
      case Templates.TEMP1:
        return <Template1TopSellerView />;
      case Templates.TEMP2:
        return <Template2TopSellerView />;
      case Templates.TEMP3:
        return <Template3TopSellerView />;
      case Templates.TEMP4:
        return <Template4TopSellerView />;
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

export default TopSellerView;
