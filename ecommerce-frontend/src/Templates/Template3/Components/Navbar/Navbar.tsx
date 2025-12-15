import search from "Assets/Icons/search.svg";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetListOfCategoriesQuery } from "Services/CategoryApiSlice";
import CircularLoader from "../Common/CircularLoader";

type Props = {
  brandName: string;
};

const Navbar = ({ brandName }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: categories, isLoading } = useGetListOfCategoriesQuery();



  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="font-montserrat tracking-widest font-semibold w-full relative bg-black flex overflow-x-hidden">
        <div className="w-full py-3 animate-marquee whitespace-nowrap ">
          <p className="text-center uppercase text-xs text-white">
            Hassle-Free Returns
          </p>
        </div>
      </div>
      <div className="xl:mx-20 px-4 py-4 flex justify-between items-center font-lato relative">
        <div className="flex items-center space-x-4">
          {/* Hamburger Button (Mobile) */}
          <button
            className="lg:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

                    {/* Brand Logo */}
                    <div className="text-2xl tracking-widest font-lato py-2">
                        <Link to="/" className="">
                            <img src={`${process.env.PUBLIC_URL}/tmar_logo.png`} alt="Logo" />
                        </Link>
                    </div>
                </div>
                {/* Desktop Menu */}
                <nav className="hidden lg:flex space-x-10 font-medium">
                    {isLoading ? <CircularLoader /> : (categories?.map((category, i) => {
                     
                        return (     
                        <Link
                            key={i}
                            to={`/shop/${category.categoryCode}`}
                            state={{ categoryName: category.categoryName }}
                            className="relative text-gray-600 hover:text-black transition group font-circe uppercase"
                        >
                            {category.categoryName}
                            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                       
                    )})) }

                    <Link
                        to="/new-collections?page=1"
                        className="relative text-gray-600 hover:text-black transition group font-circe uppercase"
                    >
                        New Arrivals
                        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                    </Link>

                    <Link
                        to="/top-sellers?page=1"
                        className="relative text-gray-600 hover:text-black transition group font-circe uppercase"
                    >
                        Top Products
                        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </nav>

                {/* Search Icon */}
                <div className="flex space-x-6 items-center">
                    <img src={search} alt="search" className="w-5 h-5" />
                    <Link
                        to="/register"
                        className="hidden lg:flex relative text-gray-600 hover:text-black transition group font-circe uppercase text-sm"
                    >
                        Register with us to explore our latest promotion!
                        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </div>

                {/* Mobile Menu Dropdown */}
                {menuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-start space-y-4 px-4 py-6 lg:hidden">
                        {categories && categories.map((category, i) => (
                            <Link
                                key={i}
                                to={`/shop/${category.categoryCode}`}
                                state={{ categoryName: category.categoryName }}
                                className="text-gray-700 hover:text-black font-medium w-full uppercase"
                            >
                                {category.categoryName}
                            </Link>
                        ))}
                        <Link
                            to="/new-collections?page=1"
                            className="relative text-gray-700 hover:text-black font-medium w-full uppercase"
                        >
                            New Arrivals
                        </Link>
                        <Link
                            to="/top-sellers?page=1"
                            className="text-gray-700 hover:text-black font-medium w-full uppercase"
                        >
                            Top Products
                        </Link>
                        <Link
                            to="/register"
                            className="relative text-gray-600 hover:text-black transition group font-circe uppercase"
                        >
                            Register with us to explore our latest promotion!
                            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Navbar;
