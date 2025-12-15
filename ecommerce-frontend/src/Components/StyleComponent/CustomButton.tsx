import type { FC, ButtonHTMLAttributes } from "react";

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const CustomButton: FC<CustomButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="uppercase tracking-wide md:tracking-widest bg-white text-black border border-white font-semibold px-2 md:px-8 py-1 md:py-4 transition-all duration-300 ease-in-out hover:bg-transparent hover:text-white relative overflow-hidden group"
      {...props}
    >
      <span className="relative z-10 text-xs">{children}</span>
      <span className="absolute inset-0 bg-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
    </button>
  );
};

export default CustomButton;
