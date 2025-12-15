export interface Props {
  brandName: string;
}

export interface Category {
  name: string;
  code: string;
  image?: string;
  subs: Array<{ name: string; code: string }>;
}

export interface NavbarInteraction {
  dropdownRef: React.RefObject<HTMLDivElement>;
  scrollRef: React.RefObject<HTMLDivElement>;
  activeDropdown: string | null;
  hoveredCategory: string | null;
  showLeft: boolean;
  showRight: boolean;
  dropdownLeft: number | null;
  handleNavigation: (path: string) => void;
  handleDropdownToggle: (
    menu: string,
    btnRef: React.RefObject<HTMLButtonElement>
  ) => void;
  setHoveredCategory: (category: string | null) => void;
  updateDropdownPosition: (btn: HTMLButtonElement | null) => void;
  scroll: (direction: "left" | "right") => void;
}

export interface DesktopHeaderProps extends NavbarInteraction {
  brandName: string;
  mappedCategories: Category[];
  authors: string[];
  languages: string[];
  academics: string[];
  merchandises: string[];
  isLoading: boolean;
  error: any;
  isCartOpen?: boolean;
  onCartOpen?: () => void;
  onCartClose?: () => void;
}

export interface NavigationMenuProps extends NavbarInteraction {
  mappedCategories: Category[];
  authors: string[];
  languages: string[];
  academics: string[];
  merchandises: string[];
  isLoading: boolean;
  error: any;
}

export interface Template4NavbarProps {
  brandName: string;
  isCartOpen?: boolean;
  onCartOpen?: () => void;
  onCartClose?: () => void;
}

export interface Template4BottomNavbarProps {
  brandName: string;
  onCartOpen?: () => void;
}
