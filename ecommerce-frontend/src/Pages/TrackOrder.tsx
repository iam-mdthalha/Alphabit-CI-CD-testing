import { Suspense, lazy } from "react";
import { Templates } from "Enums/Templates";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "State/store";
import ErrorTemplate from "Templates/ErrorTemplate/ErrorTemplate";
import CircleLoader from "Components/Common/CircleLoader";

const Template2TrackOrder = lazy(() => import("Templates/Template2/Pages/TrackOrder"));
const Template4TrackOrder = lazy(() => import("Templates/Template4/Pages/TrackOrder"));


const TrackOrder = () => {
  const selectedTemplate = useSelector(
    (state: RootState) => state.template.selected
  );
  const navigate = useNavigate();

  const chooseTemplate = (template: Templates) => {
    switch (template) {
      case Templates.TEMP2:
        return <Template2TrackOrder />;
        case Templates.TEMP4:
          return <Template4TrackOrder />;
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

export default TrackOrder;
