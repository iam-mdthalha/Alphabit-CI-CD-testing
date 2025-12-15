import React from "react";
import { Link } from "react-router-dom";
import { DesktopHeaderProps } from "Types/Navbar";
import SearchBar from "Templates/Template4/Components/Navbar/SearchBar";
import UserActions from "Templates/Template4/Components/Navbar/UserActions";
import NavigationMenu from "Templates/Template4/Components/Navbar/NavigationMenu";
import MiniCartSidebar from "Templates/Template4/Components/Common/MiniCartSidebar";

const DesktopHeader: React.FC<DesktopHeaderProps> = (props) => {
  const { isCartOpen, onCartOpen, onCartClose } = props;

  return (
    <>
      <div className="hidden md:flex bg-vintageBg px-6 lg:px-16 xl:px-24 py-3 items-center justify-between">
        <Link to="/">
          <h1 className="text-2xl lg:text-3xl xl:text-4xl text-vintageText font-melodramaRegular tracking-wider font-bold">
            {props.brandName}
          </h1>
        </Link>

        <div className="flex-1 px-2 lg:px-8">
          <SearchBar />
        </div>

        <UserActions
          onNavigation={props.handleNavigation}
          onCartClick={onCartOpen}
        />
      </div>

      <NavigationMenu {...props} />

      <MiniCartSidebar
        open={isCartOpen || false}
        onClose={onCartClose || (() => {})}
      />
    </>
  );
};

export default DesktopHeader;
