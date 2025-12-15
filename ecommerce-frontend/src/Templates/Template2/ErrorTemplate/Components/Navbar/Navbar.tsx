"use client";

import { useWindowScroll } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGetListOfCategoriesQuery } from "Services/CategoryApiSlice";
import { useCustomerQuery } from "Services/CustomerApiSlice";
import { AppDispatch, RootState } from "State/store";
import { toTitleCase } from "Utilities/ToTitleCase";
import classes from "./Navbar.module.css";

type Props = {
  brandName: string;
};

type MenuLink = {
  label: string;
  href: string;
  subMenu?: { label: string; href: string }[];
  title?: string;
};

const primaryMenuLinks: Record<string, MenuLink> = {
  shop: {
    label: "Shop",
    href: "",
  },
  newArrival: { label: "Top Seller", href: "/top-sellers?page=1" },
  sale: { label: "Sale", href: "/sale", title: "Sale" },
  returnPolicy: { label: "Return Policy", href: "/return-policy" },
};

const Navbar = ({ brandName }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(true);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { data: categories } = useGetListOfCategoriesQuery();
  const [scroll, scrollTo] = useWindowScroll();
  const { token } = useSelector((state: RootState) => state.login);
  const { isLoggedIn } = useSelector((state: RootState) => state.stateevents);
  const dispatch: AppDispatch = useDispatch();
  const cartList = useSelector((state: RootState) => state.cart.cartList);
  const [searchOffset, setSearchOffset] = useState("all");
  const [searchValue, setSearchValue] = useState("");

  const { isLoading } = useCustomerQuery(
    undefined,
    {
      skip: token === null || token === "" || !isLoggedIn,
    }
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleSearch = () => {
    if (searchValue) {
      navigate(`/s?search=${searchValue}&offset=all&page=1`);
    }
  };

  return (
    <>
   
      <div
        className={`${
          classes.navbar
        } sticky top-0 w-full grid grid-cols-3 lg:grid-cols-2 xl:grid-cols-5 items-center justify-between px-6 lg:px-8 xl:px-16 font-montserrat tracking-widest font-semibold z-20 ${
          isSearchVisible ? "relative" : ""
        }`}
      >
        <div className="w-full hidden lg:flex justify-center xl:justify-start gap-x-8 xl:gap-x-12 order-3 xl:order-1 col-span-2">
          <div className="relative group">
            <p className={`${classes.menuItem} cursor-pointer py-4 group`}>
              <a
                href={primaryMenuLinks.shop.href}
                className="uppercase text-xs"
              >
                {primaryMenuLinks.shop.label}
              </a>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
            </p>
            <div className="z-50 absolute left-0 min-w-60 hidden bg-black text-white group-hover:block">
              <ul className="space-y-2 px-6 py-3">
                {categories ? (
                  categories.map((category, i) => {
                    return (
                      <li key={i}>
                        <Link to={`/shop/${category.categoryCode}?page=1`}>
                          <p className="uppercase text-xs font-normal hover:font-bold transition-all duration-300">
                            {toTitleCase(category.categoryName)}
                          </p>
                        </Link>
                      </li>
                    );
                  })
                ) : (
                  <p className="text-center uppercase text-xs font-normal text-gray-400">
                    No Categories found
                  </p>
                )}
              </ul>
            </div>
          </div>

          {Object.keys(primaryMenuLinks).map((key) => {
            const link = primaryMenuLinks[key as keyof typeof primaryMenuLinks];

            if (key !== "shop") {
              return (
                <p
                  className={`${classes.menuItem} cursor-pointer group relative py-4`}
                  key={key}
                >
                  <a href={link.href} className="uppercase text-xs">
                    {link.label}
                  </a>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </p>
              );
            }
            return null;
          })}
        </div>

        <div className="lg:hidden">
          <button onClick={() => setIsMenuOpen(true)} className="text-white cursor-pointer">
            {/* <Menu size={24} /> */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu-icon lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>

        <div className="flex justify-center lg:justify-start xl:justify-center text-3xl tracking-widest font-nunito py-2 col-span-1 lg:order-1 xl:order-2">
          <a href="/" className="">
            {brandName}
          </a>
        </div>


      </div>

      {/* MOBILE */}
      <div
        className={`w-full fixed inset-0 z-50 lg:hidden ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setIsMenuOpen(false)}
        ></div>
        <nav
          className={`w-full fixed inset-y-0 left-0 bg-[#1C1B1B] transform ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out overflow-y-auto`}
        >
          <div className="flex justify-end p-4">
            <button onClick={() => setIsMenuOpen(false)} className="text-white">
              {/* <X size={24} /> */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          
        </nav>
      </div>
    </>
  );
};

export default Navbar;
