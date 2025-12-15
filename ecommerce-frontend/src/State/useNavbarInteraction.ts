import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useNavbarInteraction = () => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [dropdownLeft, setDropdownLeft] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleNavigation = (path: string) => {
    window.scrollTo(0, 0);
    navigate(path);
    setActiveDropdown(null);
  };

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const updateDropdownPosition = (btn: HTMLButtonElement | null) => {
    const container = dropdownRef.current;
    const scroller = scrollRef.current;
    if (!btn || !container || !scroller) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const left = btnRect.left - containerRect.left + scroller.scrollLeft;
    const maxLeft = Math.max(8, container.clientWidth - 24);
    const finalLeft = Math.max(8, Math.min(left, maxLeft));

    setDropdownLeft(finalLeft);
  };

  const handleDropdownToggle = (
    menu: string,
    btnRef: React.RefObject<HTMLButtonElement>
  ) => {
    const next = activeDropdown === menu ? null : menu;
    setActiveDropdown(next);
    if (next && btnRef.current) {
      requestAnimationFrame(() => updateDropdownPosition(btnRef.current));
    } else {
      setDropdownLeft(null);
      setHoveredCategory(null);
    }
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -240 : 240,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();

    const onScroll = () => {
      checkScroll();
    };

    const onResize = () => {
      checkScroll();
    };

    el.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
        setDropdownLeft(null);
        setHoveredCategory(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return {
    dropdownRef,
    scrollRef,
    activeDropdown,
    hoveredCategory,
    showLeft,
    showRight,
    dropdownLeft,
    handleNavigation,
    handleDropdownToggle,
    setHoveredCategory,
    updateDropdownPosition,
    scroll,
  };
};
