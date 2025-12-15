export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div
      className={`font-gilroyRegular tracking-wider bg-white rounded-lg border shadow-sm overflow-hidden p-4 pt-8 ${className}`}
    >
      {children}
    </div>
  );
};
