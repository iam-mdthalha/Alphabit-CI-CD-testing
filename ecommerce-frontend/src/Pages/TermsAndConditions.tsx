import { Suspense, lazy } from "react";
import { Templates } from "Enums/Templates";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "State/store";
import ErrorTemplate from "Templates/ErrorTemplate/ErrorTemplate";
import CircleLoader from "Components/Common/CircleLoader";

const Template2TermsAndConditions = lazy(
  () => import("Templates/Template2/Pages/TermsAndConditions")
);
const Template4TermsAndConditions = lazy(
  () => import("Templates/Template4/Pages/TermsAndConditions")
);

const TermsAndConditions = () => {
  const selectedTemplate = useSelector(
    (state: RootState) => state.template.selected
  );
  const navigate = useNavigate();

  const chooseTemplate = (template: Templates) => {
    switch (template) {
      case Templates.TEMP2:
        return <Template2TermsAndConditions />;
      case Templates.TEMP4:
        return <Template4TermsAndConditions />;
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

export default TermsAndConditions;
