import { Templates } from "Enums/Templates";
import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "State/store";
import ErrorTemplate from "Templates/ErrorTemplate/ErrorTemplate";
import CircleLoader from "Components/Common/CircleLoader";

const Template2OTPLogin = lazy(
  () => import("Templates/Template2/Pages/OTPLogin")
);
const Template4OTPLogin = lazy(
  () => import("Templates/Template4/Pages/OTPLogin")
);

const OTPLogin = () => {
  const selectedTemplate = useSelector(
    (state: RootState) => state.template.selected
  );

  const chooseTemplate = (templates: Templates) => {
    switch (templates) {
      case Templates.TEMP1:
        return <ErrorTemplate />;
      case Templates.TEMP2:
        return <Template2OTPLogin />;
      case Templates.TEMP3:
        return <ErrorTemplate />;
      case Templates.TEMP4:
        return <Template4OTPLogin />;
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

export default OTPLogin;
