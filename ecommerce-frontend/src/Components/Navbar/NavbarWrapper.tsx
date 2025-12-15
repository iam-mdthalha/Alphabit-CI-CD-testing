import { Templates } from "Enums/Templates";
import { useSelector } from "react-redux";
import type { RootState } from "State/store";
import ErrorTemplateNavbar from "Templates/ErrorTemplate/Components/Navbar/Navbar";
import Template1Wrapper from "Templates/Template1/Components/Navbar/NavbarWrapper";
import Template2Navbar from "Templates/Template2/Components/Navbar/Navbar";
import Template2BottomNavbar from "Templates/Template2/Components/Navbar/BottomNavbar";
import Template3Navbar from "Templates/Template3/Components/Navbar/Navbar";
import Template4Navbar from "Templates/Template4/Components/Navbar/Navbar";
import { useState } from "react";
import AnnouncementBar from "Templates/Template4/Components/Navbar/AnnouncementBar";

type Props = {
  brandName: string;
};

const NavbarWrapper = ({ brandName }: Props) => {
  const selectedTemplate = useSelector(
    (state: RootState) => state.template.selected
  );

  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const chooseTemplate = (template: Templates) => {
    switch (template) {
      case Templates.TEMP1:
        return <Template1Wrapper brandName={brandName} />;
      case Templates.TEMP2:
        return (
          <>
            <Template2Navbar brandName={brandName} />
            <Template2BottomNavbar />
          </>
        );
      case Templates.TEMP3:
        return <Template3Navbar brandName={brandName} />;
      case Templates.TEMP4:
        return (
          <>
            <AnnouncementBar />
            <Template4Navbar
              brandName={brandName}
              isCartOpen={isCartOpen}
              onCartOpen={openCart}
              onCartClose={closeCart}
            />
          </>
        );
      default:
        return <ErrorTemplateNavbar brandName={brandName} />;
    }
  };

  return <>{chooseTemplate(selectedTemplate)}</>;
};

export default NavbarWrapper;
