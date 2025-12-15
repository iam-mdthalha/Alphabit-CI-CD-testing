import { Suspense, lazy } from "react";
import { Templates } from "Enums/Templates";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "State/store";
import ErrorTemplate from "Templates/ErrorTemplate/ErrorTemplate";
import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";

const Template2TErrorTemplate = lazy(
  () => import("Templates/Template2/ErrorTemplate/ErrorTemplate")
);

const Template4TErrorTemplate = lazy(
  () => import("Templates/Template4/ErrorTemplate/ErrorTemplate")
);

const TErrorTemplate = () => {
  const selectedTemplate = useSelector(
    (state: RootState) => state.template.selected
  );
  const navigate = useNavigate();

  const chooseTemplate = (template: Templates) => {
    switch (template) {
      case Templates.TEMP2:
        return <Template2TErrorTemplate />;
      case Templates.TEMP4:
        return <Template4TErrorTemplate />;
      default:
        return <Template2TErrorTemplate />;
    }
  };
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen justify-center items-center">
          <CircleLoader />
        </div>
      }
    >
      <>{chooseTemplate(selectedTemplate)}</>
    </Suspense>
  );
};

export default TErrorTemplate;
