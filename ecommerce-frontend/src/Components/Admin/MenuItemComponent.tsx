import React, { useMemo } from "react";
import { Link } from "react-router-dom";

interface MenuItem {
  name: string;
  icon: React.ElementType;
  href?: string;
  submenu?: MenuItem[];
}

export const MenuItemComponent: React.FC<{
  item: MenuItem;
  expanded: boolean;
  currentPath: string;
  toggleSubmenu: (name: string) => void;
  toggleSidebar: () => void;
}> = React.memo(
  ({ item, expanded, currentPath, toggleSubmenu, toggleSidebar }) => {
    const isActive = (href?: string) => href === currentPath;
    const isParentActive = useMemo(
      () =>
        item.submenu
          ? item.submenu.some((subItem) => isActive(subItem.href))
          : false,
      [item.submenu, currentPath, isActive]
    );

    const handleSidebarClose = () => {
      if (window.innerWidth < 768) toggleSidebar();
    };

    if (item.submenu) {
      const isActiveParent = isParentActive || isActive(item.href);
      return (
        <li>
          <button
            onClick={() => toggleSubmenu(item.name)}
            className={`font-gilroyRegular tracking-wider flex items-center justify-between w-full px-4 py-2 text-sm font-semibold rounded-lg ${
              isActiveParent ? "text-white" : "text-white hover:bg-[#2B3567]"
            }`}
          >
            <div className="flex items-center gap-2">
              <item.icon className="w-5 h-5 mr-3" aria-hidden="true" />
              {item.name}
            </div>
            {expanded ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-down-icon lucide-chevron-down w-4 h-4 transition-transform duration-200"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-right-icon lucide-chevron-right w-4 h-4 transition-transform duration-200"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            )}
          </button>

          <div
            className={`transition-all duration-300 ease-in-out ${
              expanded ? "opacity-100" : "max-h-0 opacity-0 invisible"
            }`}
          >
            <ul className="pl-6 mt-1 space-y-1">
              {item.submenu.map((subItem) => (
                <li key={subItem.name}>
                  <Link
                    to={subItem.href || "#"}
                    onClick={handleSidebarClose}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-semilbold rounded-lg ${
                      isActive(subItem.href)
                        ? "bg-white text-[#5A607F]"
                        : "text-white hover:bg-[#2B3567]"
                    }`}
                  >
                    <subItem.icon className="w-4 h-4 mr-3" aria-hidden="true" />
                    {subItem.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </li>
      );
    }

    return (
      <li>
        <Link
          to={item.href || "#"}
          onClick={handleSidebarClose}
          className={`font-gilroyRegular tracking-wider flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg ${
            isActive(item.href)
              ? "bg-white text-[#5A607F]"
              : "text-white hover:bg-[#2B3567]"
          }`}
        >
          <item.icon className="w-5 h-5 mr-3" aria-hidden="true" />
          {item.name}
        </Link>
      </li>
    );
  }
);
