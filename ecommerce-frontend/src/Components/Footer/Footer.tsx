import { Templates } from "Enums/Templates";
import { useSelector } from "react-redux";
import type { RootState } from "State/store";
import Template1Footer from "Templates/Template1/Components/Footer/Footer";
import Template2Footer from "Templates/Template2/Components/Footer/Footer";
import Template3Footer from "Templates/Template3/Components/Footer/Footer";
import Template4Footer from "Templates/Template4/Components/Footer/Footer";

interface FooterProps {
  brandName: string;
}

const Footer: React.FC<FooterProps> = ({ brandName }) => {
  const selectedTemplate = useSelector(
    (state: RootState) => state.template.selected
  );

  const chooseTemplate = (template: Templates) => {
    switch (template) {
      case Templates.TEMP1:
        return <Template1Footer brandName={brandName} />;
      case Templates.TEMP2:
        return <Template2Footer />
      case Templates.TEMP3:
        return <Template3Footer />
      case Templates.TEMP4:
        return <Template4Footer brandName={brandName} />
      default:
        return <Template3Footer />
    }
  }

  return (
    <div>
      {chooseTemplate(selectedTemplate)}
    </div>
  );
};

export default Footer;
