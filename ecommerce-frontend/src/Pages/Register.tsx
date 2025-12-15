import { Templates } from "Enums/Templates";
import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "State/store";
import ErrorTemplate from "Templates/ErrorTemplate/ErrorTemplate";
import CircleLoader from "Components/Common/CircleLoader";

const Template1Register = lazy(
  () => import("Templates/Template1/Pages/Register")
);
const Template2Register = lazy(
  () => import("Templates/Template2/Pages/Register")
);
const Template3Register = lazy(
  () => import("Templates/Template3/Pages/Register")
);
const Template4Register = lazy(
  () => import("Templates/Template4/Pages/Register")
);

const Register = () => {
  const selectedTemplate = useSelector(
    (state: RootState) => state.template.selected
  );

  const chooseTemplate = (template: Templates) => {
    switch (template) {
      case Templates.TEMP1:
        return <Template1Register />;
      case Templates.TEMP2:
        return <Template2Register />;
      case Templates.TEMP3:
        return <Template3Register />;
      case Templates.TEMP4:
        return <Template4Register />;
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

export default Register;
