export const Header: React.FC<{
  title: string;
  onAdd?: () => void;
  addLabel?: string;
}> = ({ title, onAdd, addLabel }) => {
  return (
    <header className="font-gilroyRegular tracking-wider w-full flex items-center justify-between mb-6">
      <h1 className="text-md md:text-2xl font-bold tracking-tight">{title}</h1>
      {onAdd && (
        <button
          onClick={onAdd}
          className="px-[.15rem] md:px-3 py-[.13rem] md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs md:text-sm"
        >
          + {addLabel}
        </button>
      )}
    </header>
  );
};
