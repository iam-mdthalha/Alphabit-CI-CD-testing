import { Templates } from "Enums/Templates";
import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "State/store";
import ErrorTemplate from "Templates/ErrorTemplate/ErrorTemplate";
import CircleLoader from "Components/Common/CircleLoader";

const Template1SectionView = lazy(
  () => import("Templates/Template1/Pages/SectionView")
);
const Template2SectionView = lazy(
  () => import("Templates/Template2/Pages/SectionView")
);
const Template3SectionView = lazy(
  () => import("Templates/Template3/Pages/SectionView")
);

const SectionView = () => {
  const selectedTemplate = useSelector(
    (state: RootState) => state.template.selected
  );

  const chooseTemplate = (template: Templates) => {
    switch (template) {
      case Templates.TEMP1:
        return <Template1SectionView />;
      case Templates.TEMP2:
        return <Template2SectionView />;
      case Templates.TEMP3:
        return <Template3SectionView />;
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

export default SectionView;
