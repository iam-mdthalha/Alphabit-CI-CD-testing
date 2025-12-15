import { Templates } from "Enums/Templates";
import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "State/store";
import ErrorTemplate from "Templates/ErrorTemplate/ErrorTemplate";
import CircleLoader from "Components/Common/CircleLoader";

const Template2InvoicePreview = lazy(
  () => import("Templates/Template2/Pages/InvoicePreview")
);

const Template4InvoicePreview = lazy(
  () => import("Templates/Template4/Pages/InvoicePreview")
);

const InvoicePreview = () => {
  const selectedTemplate = useSelector(
    (state: RootState) => state.template.selected
  );

  const chooseTemplate = (template: Templates) => {
    switch (template) {
      case Templates.TEMP2:
        return <Template2InvoicePreview />;
      case Templates.TEMP4:
        return <Template4InvoicePreview />;
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

export default InvoicePreview;
