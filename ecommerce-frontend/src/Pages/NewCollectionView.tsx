import { Templates } from "Enums/Templates";
import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "State/store";
import ErrorTemplate from "Templates/ErrorTemplate/ErrorTemplate";
import CircleLoader from "Components/Common/CircleLoader";

const Template1NewCollectionView = lazy(
  () => import("Templates/Template1/Pages/NewCollectionView")
);
const Template2NewCollectionView = lazy(
  () => import("Templates/Template2/Pages/NewCollectionView")
);
const Template3NewCollectionView = lazy(
  () => import("Templates/Template3/Pages/NewCollectionView")
);
const Template4NewCollectionView = lazy(
  () => import("Templates/Template4/Pages/NewCollectionView")
);

const NewCollectionView = () => {
  const selectedTemplate = useSelector(
    (state: RootState) => state.template.selected
  );

  const chooseTemplate = (template: Templates) => {
    switch (template) {
      case Templates.TEMP1:
        return <Template1NewCollectionView />;
      case Templates.TEMP2:
        return <Template2NewCollectionView />;
      case Templates.TEMP3:
        return <Template3NewCollectionView />;
      case Templates.TEMP4:
        return <Template4NewCollectionView />;
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

export default NewCollectionView;
