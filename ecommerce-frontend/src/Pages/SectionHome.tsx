import { Templates } from "Enums/Templates";
import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "State/store";
import ErrorTemplate from "Templates/ErrorTemplate/ErrorTemplate";
import CircleLoader from "Components/Common/CircleLoader";

const Template1SectionHome = lazy(
  () => import("Templates/Template1/Pages/SectionHome")
);
const Template2SectionHome = lazy(
  () => import("Templates/Template2/Pages/SectionHome")
);
const Template3SectionHome = lazy(
  () => import("Templates/Template3/Pages/SectionHome")
);
const Template4SectionHome = lazy(
  () => import("Templates/Template4/Pages/SectionHome")
);

const SectionHome = () => {
  const selectedTemplate = useSelector(
    (state: RootState) => state.template.selected
  );

  const chooseTemplate = (template: Templates) => {
    switch (template) {
      case Templates.TEMP1:
        return <Template1SectionHome />;
      case Templates.TEMP2:
        return <Template2SectionHome />;
      case Templates.TEMP3:
        return <Template3SectionHome />;
      case Templates.TEMP4:
        return <Template4SectionHome />;
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

export default SectionHome;
