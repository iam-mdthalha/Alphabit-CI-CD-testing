import React from "react";
import { useNavigate } from "react-router-dom";

interface SimpleListDropdownProps {
  style: React.CSSProperties;
  items: string[];
  type: "language" | "academic" | "merchandise";
  onMouseLeave: () => void;
}

const SimpleListDropdown: React.FC<SimpleListDropdownProps> = ({
  style,
  items,
  type,
  onMouseLeave,
}) => {
  const navigate = useNavigate();

  const handleItemClick = (item: string) => {
    navigate(`/books-listing?${type}=${encodeURIComponent(item)}`);
  };

  if (!items.length) {
    return (
      <DropdownContainer style={style} onMouseLeave={onMouseLeave}>
        <p className="p-4 text-sm text-gray-500">No {type}s found</p>
      </DropdownContainer>
    );
  }

  return (
    <DropdownContainer style={style} onMouseLeave={onMouseLeave}>
      <div className="p-4">
        <ul className="space-y-2">
          {items.map((item, index) => (
            <ListItem
              key={index}
              item={item}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </ul>
      </div>
    </DropdownContainer>
  );
};

const ListItem: React.FC<{ item: string; onClick: () => void }> = ({
  item,
  onClick,
}) => (
  <li
    className="py-1 px-2 cursor-pointer text-sm lg:text-base text-gray-800 font-gilroyRegular font-semibold tracking-wider hover:text-vintageText"
    onClick={onClick}
  >
    {item}
  </li>
);

const DropdownContainer: React.FC<{
  style: React.CSSProperties;
  onMouseLeave: () => void;
  children: React.ReactNode;
}> = ({ style, onMouseLeave, children }) => (
  <div
    className="absolute top-full mt-0 w-48 bg-vintageBg bg-opacity-90 rounded-2xl z-50 shadow-lg"
    style={style}
    onMouseLeave={onMouseLeave}
  >
    {children}
  </div>
);

export default SimpleListDropdown;
