import { useLocation } from "react-router-dom";
import { useGetListOfCategoriesQuery } from "Services/CategoryApiSlice";
import CategoryNavbar from "Templates/Template1/Components/Navbar/CategoryNavbar/CategoryNavbar";
import Navbar from "Templates/Template1/Components/Navbar/Navbar";

type Props = {
  brandName: string;
};

const NavbarWrapper = ({ brandName }: Props) => {
  const location = useLocation();

  const { data: categories, isLoading } = useGetListOfCategoriesQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ zIndex: 99, display: "unset" }}>
      {categories && (
        <>
          <Navbar brandName={brandName} categories={categories} />
          {location.pathname !== "/" && (
            <div>
              <CategoryNavbar categories={categories} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NavbarWrapper;
