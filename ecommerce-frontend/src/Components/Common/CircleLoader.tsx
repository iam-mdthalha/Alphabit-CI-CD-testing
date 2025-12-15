import { Suspense, lazy } from "react";
import { Templates } from "Enums/Templates";
import { useSelector } from "react-redux";
import type { RootState } from "State/store";
import Template1CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";
import Template4CircleLoader from "Templates/Template4/Components/Common/CircularLoader";

const CircleLoader = () => {
  const selectedTemplate = useSelector(
    (state: RootState) => state.template.selected
  );

  switch (selectedTemplate) {
    case Templates.TEMP1:
      return <Template1CircleLoader />;
    case Templates.TEMP4:
      return <Template4CircleLoader />;
    default:
      return <Template1CircleLoader />;
  }
};

export default CircleLoader;
