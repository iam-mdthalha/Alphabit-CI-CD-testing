import React from "react";
import { useNavigate } from "react-router-dom";

interface AuthorsDropdownProps {
  style: React.CSSProperties;
  authors: string[];
  isLoading: boolean;
  error: any;
  onMouseLeave: () => void;
}

const AuthorsDropdown: React.FC<AuthorsDropdownProps> = ({
  style,
  authors,
  isLoading,
  error,
  onMouseLeave,
}) => {
  const navigate = useNavigate();

  const handleAuthorClick = (author: string) => {
    navigate(`/books-listing?author=${encodeURIComponent(author)}`);
  };

  if (isLoading) {
    return (
      <DropdownContainer style={style} onMouseLeave={onMouseLeave}>
        <div className="p-4">
          <p className="text-sm text-gray-500">Loading authors...</p>
        </div>
      </DropdownContainer>
    );
  }

  if (error) {
    return (
      <DropdownContainer style={style} onMouseLeave={onMouseLeave}>
        <div className="p-4">
          <p className="text-sm text-red-500">Failed to load authors</p>
        </div>
      </DropdownContainer>
    );
  }

  if (authors.length === 0) {
    return (
      <DropdownContainer style={style} onMouseLeave={onMouseLeave}>
        <div className="p-4">
          <p className="text-sm text-gray-500">No authors found</p>
        </div>
      </DropdownContainer>
    );
  }

  return (
    <DropdownContainer style={style} onMouseLeave={onMouseLeave}>
      <div className="p-4">
        <ul className="space-y-2">
          {authors.map((author, index) => (
            <li
              key={index}
              className="py-1 px-2 cursor-pointer text-sm lg:text-base text-gray-800 font-gilroyRegular font-semibold tracking-wider hover:text-vintageText"
              onClick={() => handleAuthorClick(author)}
            >
              {author}
            </li>
          ))}
        </ul>
      </div>
    </DropdownContainer>
  );
};

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

export default AuthorsDropdown;
