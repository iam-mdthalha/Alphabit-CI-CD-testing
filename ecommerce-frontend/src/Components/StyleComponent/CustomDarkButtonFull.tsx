import type { ButtonHTMLAttributes, FC } from "react";

interface CustomDarkButtonFullProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const CustomDarkButtonFull: FC<CustomDarkButtonFullProps> = ({
  children,
  ...props
}) => {
  return (
    <button
      className="w-full uppercase tracking-widest bg-black text-white border border-black text-xs font-semibold px-8 py-4 transition-all duration-300 ease-in-out hover:bg-transparent hover:text-black disabled:bg-gray-600 relative overflow-hidden group"
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
    </button>
  );
};

export default CustomDarkButtonFull;
