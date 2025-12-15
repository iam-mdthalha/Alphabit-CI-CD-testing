import { Templates } from "Enums/Templates";
import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "State/store";
import ErrorTemplate from "Templates/ErrorTemplate/ErrorTemplate";
import CircleLoader from "Components/Common/CircleLoader";

const Template1ShopCategoryView = lazy(
  () => import("Templates/Template1/Pages/ShopCategoryView")
);
const Template2ShopCategoryView = lazy(
  () => import("Templates/Template2/Pages/ShopCategoryView")
);
const Template3ShopCategoryView = lazy(
  () => import("Templates/Template3/Pages/ShopCategoryView")
);
const Template4ShopCategoryView = lazy(
  () => import("Templates/Template4/Pages/ShopCategoryView")
);

const ShopCategoryView = () => {
  const selectedTemplate = useSelector(
    (state: RootState) => state.template.selected
  );

  const chooseTemplate = (template: Templates) => {
    switch (template) {
      case Templates.TEMP1:
        return <Template1ShopCategoryView />;
      case Templates.TEMP2:
        return <Template2ShopCategoryView />;
      case Templates.TEMP3:
        return <Template3ShopCategoryView />;
              case Templates.TEMP4:
        return <Template4ShopCategoryView />;
      default:
        return <ErrorTemplate />;
    }
  };

  return (
    <Suspense
      fallback={
        <CircleLoader />
      }
    >
      <>{chooseTemplate(selectedTemplate)}</>
    </Suspense>
  );
};

export default ShopCategoryView;
