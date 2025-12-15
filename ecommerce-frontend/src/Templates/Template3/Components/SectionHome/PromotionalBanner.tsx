
const PromotionalBanner = () => {
    return (
        <div
            className="bg-gray-900 text-white text-center p-24 h-[400px] md:h-[600px] lg:h-[700px] xl:h-[800px] bg-cover bg-center bg-no-repeat flex items-start justify-start"
            style={{
                backgroundImage:
                    "url('/template3/PromotionalBanner/handcrafted-italian-dress-sneakers.jpg')",
            }}
        >
            <div className="text-xl md:text-2xl w-96 space-y-5 uppercase text-left font-cardoRegular bg-black/50 px-8 py-6 rounded">
                <p>Handcrafted Dress Sneakers</p>
                {/* <Button label="Shop Now" onClick={() => {}} /> */}
            </div>
        </div>
    );
}

export default PromotionalBanner;