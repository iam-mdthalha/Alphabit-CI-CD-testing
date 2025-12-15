import type { FC, ButtonHTMLAttributes } from "react";

interface CustomDarkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const CustomDarkButton: FC<CustomDarkButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="uppercase tracking-widest bg-black text-white border border-black text-xs font-semibold px-8 py-4 transition-all duration-300 ease-in-out hover:bg-transparent hover:text-black relative overflow-hidden group"
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
    </button>
  );
};

export default CustomDarkButton;
