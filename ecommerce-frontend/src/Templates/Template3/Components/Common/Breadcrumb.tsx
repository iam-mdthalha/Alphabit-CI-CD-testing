

const Breadcrumb = () => {
    return (
        <div className="px-6 md:px-20 text-xs text-gray-500 mb-4">
            <nav className="flex space-x-1 font-circe">
                <span>Home</span>
                <span>/</span>
                <span>Men's Shoes</span>
                <span>/</span>
                <span className="text-black">monkstrap shoes</span>
            </nav>
        </div>
    );
}

export default Breadcrumb;