import { Suspense, lazy } from "react";
import { Templates } from "Enums/Templates";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "State/store";
import ErrorTemplate from "Templates/ErrorTemplate/ErrorTemplate";
import CircleLoader from "Components/Common/CircleLoader";

const Template1Login = lazy(() => import("Templates/Template1/Pages/Login"));
const Template2Login = lazy(() => import("Templates/Template2/Pages/Login"));
const Template4Login = lazy(() => import("Templates/Template4/Pages/Login"));

const Login = () => {
  const selectedTemplate = useSelector(
    (state: RootState) => state.template.selected
  );
  const navigate = useNavigate();

  const chooseTemplate = (template: Templates) => {
    switch (template) {
      case Templates.TEMP1:
        return <Template1Login />;
      case Templates.TEMP2:
        return <Template2Login />;
      case Templates.TEMP4:
        return <Template4Login />;
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

export default Login;
