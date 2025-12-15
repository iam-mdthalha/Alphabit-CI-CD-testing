export default function RecentlyViewed({ items }: any) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item: any, index: number) => (
          <div key={index} className="text-center">
            <img
              width="auto"
              height="auto"
              src={item.image}
              alt={item.name}
              className="w-full object-cover"
            />
            <h3 className="text-sm mt-2">{item.name}</h3>
            <p className="text-gray-600">${item.price.toFixed(2)}</p>
            <button className="mt-2 w-full bg-black text-white py-1">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
