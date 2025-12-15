import React from "react";
import { Props } from "Types/Navbar";
import { useNavbarData } from "State/useNavbarData";
import { useNavbarInteraction } from "State/useNavbarInteraction";
import AnnouncementBar from "Templates/Template4/Components/Navbar/AnnouncementBar";
import DesktopHeader from "Templates/Template4/Components/Navbar/DesktopHeader";
import MobileHeader from "Templates/Template4/Components/Navbar/MobileHeader";

interface Template4NavbarProps extends Props {
  isCartOpen?: boolean;
  onCartOpen?: () => void;
  onCartClose?: () => void;
}

const Navbar: React.FC<Template4NavbarProps> = ({
  brandName,
  isCartOpen,
  onCartOpen,
  onCartClose,
}) => {
  const {
    mappedCategories,
    authors,
    languages,
    academics,
    merchandises,
    isLoading,
    error,
  } = useNavbarData();

  const navbarInteraction = useNavbarInteraction();

  return (
    <div className="w-full">
      {/* <AnnouncementBar /> */}

      <DesktopHeader
        brandName={brandName}
        mappedCategories={mappedCategories}
        authors={authors}
        languages={languages}
        academics={academics}
        merchandises={merchandises}
        isLoading={isLoading}
        error={error}
        isCartOpen={isCartOpen}
        onCartOpen={onCartOpen}
        onCartClose={onCartClose}
        {...navbarInteraction}
      />

      <MobileHeader
        brandName={brandName}
        onCartOpen={onCartOpen}
      />
    </div>
  );
};

export default Navbar;
