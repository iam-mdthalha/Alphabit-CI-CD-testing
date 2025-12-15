import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllGlossaryQuery } from "Services/GlossaryApiSlice";

interface GlossaryCardItem {
  id: number;
  title: string;
  image: string;
  venue: string;
  date: string;
}

const Glossary: React.FC = () => {
  const navigate = useNavigate();
  const plant = process.env.REACT_APP_PLANT || "";

  const { data, isLoading, isError } = useGetAllGlossaryQuery({
    plant,
    search: "",
  });

  const items: GlossaryCardItem[] =
    (data as any)?.results?.map((result: any) => {
      const hdr = result.glossaryHdr || {};
      const firstImage =
        result.glossaryDetList?.[0]?.glossaryImage || "/no-image.png";

      const formattedDate = hdr.glossaryDate
        ? new Date(hdr.glossaryDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "";

      return {
        id: hdr.id,
        title: hdr.glossaryName || "",
        image: firstImage,
        venue: hdr.address || hdr.city || "",
        date: formattedDate,
      };
    }) ?? [];

  console.log("Glossary data:", data);
  console.log("Mapped items:", items);

  if (isLoading)
    return (
      <p style={{ padding: 40, textAlign: "center" }}>Loading glossary…</p>
    );

  if (isError)
    return (
      <p style={{ padding: 40, textAlign: "center", color: "red" }}>
        Failed to load glossary.
      </p>
    );

  return (
    <div className="px-6 py-6">
      <h2 className="text-2xl font-semibold mb-6">Glossary</h2>

      {items.length === 0 ? (
        <p className="text-center py-10 text-gray-500">
          No glossary items found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item: GlossaryCardItem) => (
            <div
              key={item.id}
              className="rounded-xl shadow-lg cursor-pointer hover:scale-[1.02] transition"
              style={{ background: "#0b3fa9", color: "white" }}
              onClick={() => navigate(`/glossary/view/${item.id}`)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-56 object-cover rounded-t-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/no-image.png";
                }}
              />

              <div className="p-4">
                <div className="font-bold text-base">{item.title}</div>
                <div className="text-sm opacity-80">{item.venue}</div>
                <div className="text-xs opacity-70 mt-2">{item.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Glossary;
