import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "State/AuthSlice/LoginSlice";
import { setLoggedIn } from "State/StateEvents";
import { AppDispatch, RootState } from "State/store";
import { selectWishlistCount } from "State/WishlistSlice/WishlistSlice";
import { useDispatch } from "react-redux";

interface UserActionsProps {
  onNavigation: (path: string) => void;
  onCartClick?: () => void;
}

const CustomLink: React.FC<{
  to: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ to, className, children, onClick, ...props }) => (
  <Link
    to={to}
    className={className}
    {...props}
    onClick={() => {
      window.history.scrollRestoration = "manual";
      window.scrollTo({ top: 0, behavior: "auto" }); 
      onClick?.();
    }}
  >
    {children}
  </Link>
);

const UserActions: React.FC<UserActionsProps> = ({ onNavigation, onCartClick }) => {
  const { token } = useSelector((state: RootState) => state.login);
  const { isLoggedIn } = useSelector((state: RootState) => state.stateevents);
  const cartList = useSelector((state: RootState) => state.cart.cartList);

  const wishlistCount = useSelector(selectWishlistCount);

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalQuantity = cartList.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setLoggedIn(false));
    setIsUserDropdownOpen(false);

    window.scrollTo({ top: 0, behavior: "auto" }); 
    window.location.reload();
  };

  const handleUserIconClick = () => {
    if (token && isLoggedIn) {
      window.scrollTo({ top: 0, behavior: "auto" }); 
    } else {
      navigate("/login");
      window.scrollTo({ top: 0, behavior: "auto" }); 
    }
  };

  const handleUserIconMouseEnter = () => {
    if (token && isLoggedIn) {
      setIsUserDropdownOpen(true);
    }
  };

  const handleDropdownMouseLeave = () => {
    setIsUserDropdownOpen(false);
  };

  return (
    <div className="flex gap-4 items-center">
      <CustomLink
        to="/sell-with-us"
        className="bg-yellow-500 text-vintageBg text-xs lg:text-base px-4 py-2 rounded-xl hover:bg-opacity-90 font-medium capitalize"
      >
        Sell your books
      </CustomLink>

      <CustomLink
        to="/track-order"
        className="capitalize text-sm lg:text-base text-gray-800 font-gilroyRegular font-semibold tracking-wider"
      >
        Track Order
      </CustomLink>

      <CustomLink
        to="/store-locator"
        className="capitalize text-sm lg:text-base text-gray-800 font-gilroyRegular font-semibold tracking-wider"
      >
        Store Locator
      </CustomLink>

      <div className="relative" ref={dropdownRef}>
        <div
          onClick={handleUserIconClick}
          onMouseEnter={handleUserIconMouseEnter}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="lucide lucide-user text-yellow-600"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        {token && isLoggedIn && isUserDropdownOpen && (
          <div
            className="absolute right-0 mt-2 w-48 bg-vintageBg bg-opacity-90 rounded-2xl z-[999] shadow-lg py-1"
            onMouseLeave={handleDropdownMouseLeave}
          >
            <CustomLink
              to="/order-summary"
              className="block py-2 px-4 text-sm lg:text-base text-gray-800 font-gilroyRegular font-semibold tracking-wider hover:text-vintageText"
              onClick={() => setIsUserDropdownOpen(false)}
            >
              My Orders
            </CustomLink>

            <button
              onClick={handleLogout}
              className="block w-full text-left py-2 px-4 text-sm lg:text-base text-gray-800 font-gilroyRegular font-semibold tracking-wider hover:text-vintageText"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      {token && isLoggedIn && (
        <div className="relative cursor-pointer">
          <CustomLink to="/wishlist">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill={wishlistCount > 0 ? "#dc2626" : "none"}
              stroke={wishlistCount > 0 ? "#dc2626" : "currentColor"}
              strokeWidth="2"
              className="lucide lucide-heart text-yellow-600"
            >
              <path d="M19 14c1.49-1.46 2-3.45 2-5A5 5 0 0 0 16 4c-1.54 0-3.04.77-4 2-.96-1.23-2.46-2-4-2a5 5 0 0 0-5 5c0 1.55.51 3.54 2 5l7 7Z" />
            </svg>
          </CustomLink>

          {wishlistCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </div>
      )}

      <div className="relative cursor-pointer" onClick={onCartClick} aria-label="Open mini cart">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="lucide lucide-shopping-cart text-yellow-600"
        >
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>

        {totalQuantity > 0 && (
      <span className="absolute right-[-6px]
        top-[-1px]       /* MOBILE – visually matches desktop */
        sm:top-[-4px]    /* DESKTOP – perfect baseline alignment */
       bg-red-500 text-white text-[10px] leading-none min-w-[16px] h-[16px]
       flex items-center justify-center rounded-full font-semibold"
      >
      {totalQuantity}
     </span>

        )}
      </div>
    </div>
  );
};

export { CustomLink };
export default UserActions;
