const CircularLoader = ({ size = "w-12 h-12", color = "border-t-white" }) => {
    return (
        <div className={`animate-spin rounded-full border-4 border-gray-300 ${color} ${size}`} />
    );
};

export default CircularLoader;
