import Button from "../Common/Button";

const LearnMoreGrid = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 my-12">
            {/* Text Section */}
            <div className="flex flex-col justify-center items-center space-y-5 px-6 md:px-12 py-10 text-center">
                <h6 className="uppercase font-cardoBold text-2xl">Luxuriously crafted</h6>
                <p className="text-sm">
                    Each pair of Ace Marks Italian men's dress shoes are handcrafted by
                    4th generation Italian artisans with hand-selected full grain calf leather
                    and are crafted, dyed, and burnished by hand. The lightweight Blake Flex
                    construction and leather out-sole allow for easy, effortless movement.
                </p>
                <Button label="learn more" onClick={() => { }} />
            </div>

            {/* Image Section */}
            <div
                className="h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] bg-gray-900 text-white bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage:
                        "url('/template3/LearnMoreGrid/fouth-generation-artisan.jpg')",
                }}
            ></div>
        </div>
    );
};

export default LearnMoreGrid;