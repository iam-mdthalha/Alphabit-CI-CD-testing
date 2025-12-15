type TopContentProps = {
    title: string;
    description: string;
}

const TopContent = ({ title, description }: TopContentProps) => {

    return (
        <div className="px-6 md:px-20 py-10">
            <h1 className="text-3xl font-cardoBold font-bold mb-4">{ title }</h1>
            <p className="text-gray-700 mb-4 max-w-3xl font-circe">
               { description }
            </p>
            <div className="flex flex-wrap gap-2 font-circe">
                {["Black Wedding Shoes", "Black Dress Shoes", "Brown Monk Strap Shoes", "Black Monk Strap Shoes", "Italian Leather Oxford Shoes for Men", "Italian Oxford Style Wholecut Dress Shoes"].map((tag, idx) => (
                    <button key={idx} className="px-4 py-1 border border-black rounded-full text-sm">
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default TopContent;