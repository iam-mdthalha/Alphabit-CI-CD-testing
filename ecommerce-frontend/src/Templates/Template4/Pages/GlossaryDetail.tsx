import React from "react";
import { useParams } from "react-router-dom";
import { useGetGlossaryByIdQuery } from "Services/GlossaryApiSlice";

const GlossaryDetail: React.FC = () => {
  const { id } = useParams();
  const plant = process.env.REACT_APP_PLANT || "";

  const { data, isLoading, isError } = useGetGlossaryByIdQuery({
    id: Number(id),
    plant,
  });

  console.log("Detail API Response:", data);

  if (isLoading)
    return <p style={{ padding: 40, textAlign: "center" }}>Loading details…</p>;

  if (isError)
    return (
      <p style={{ padding: 40, textAlign: "center", color: "red" }}>
        Failed to load glossary details. Check console for errors.
      </p>
    );

  if (!data) {
    return (
      <p style={{ padding: 40, textAlign: "center", color: "orange" }}>
        No data returned from API for ID: {id}
      </p>
    );
  }

  let glossaryItem;
  if (Array.isArray(data?.results) && data.results.length > 0) {
    glossaryItem = data.results[0];
  } else if (data) {
    glossaryItem = data;
  }

  if (!glossaryItem) {
    return (
      <p style={{ padding: 40, textAlign: "center", color: "red" }}>
        Glossary item not found for ID: {id}
      </p>
    );
  }

  const hdr = glossaryItem.glossaryHdr || glossaryItem || {};

  const images = [];
  if (
    glossaryItem.glossaryDetList &&
    Array.isArray(glossaryItem.glossaryDetList)
  ) {
    glossaryItem.glossaryDetList.forEach((det: any) => {
      if (det.glossaryImage) images.push(det.glossaryImage);
    });
  }

  if (images.length === 0 && glossaryItem.image) {
    images.push(glossaryItem.image);
  }

  const highlights = [
    {
      title: hdr.section1Title || hdr.highlightTitle1 || "",
      description: hdr.section1Description || hdr.highlightDesc1 || "",
    },
    {
      title: hdr.section2Title || hdr.highlightTitle2 || "",
      description: hdr.section2Description || hdr.highlightDesc2 || "",
    },
    {
      title: hdr.section3Title || hdr.highlightTitle3 || "",
      description: hdr.section3Description || hdr.highlightDesc3 || "",
    },
    {
      title: hdr.section4Title || hdr.highlightTitle4 || "",
      description: hdr.section4Description || hdr.highlightDesc4 || "",
    },
    {
      title: hdr.section5Title || hdr.highlightTitle5 || "",
      description: hdr.section5Description || hdr.highlightDesc5 || "",
    },
    {
      title: hdr.section6Title || hdr.highlightTitle6 || "",
      description: hdr.section6Description || hdr.highlightDesc6 || "",
    },
    {
      title: hdr.section7Title || hdr.highlightTitle7 || "",
      description: hdr.section7Description || hdr.highlightDesc7 || "",
    },
    {
      title: hdr.section8Title || hdr.highlightTitle8 || "",
      description: hdr.section8Description || hdr.highlightDesc8 || "",
    },
  ].filter((item) => item.title || item.description);

  const formattedDate = hdr.glossaryDate
    ? new Date(hdr.glossaryDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : hdr.date
    ? new Date(hdr.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div className="px-6 py-6 max-w-4xl mx-auto">
      <div style={{ display: "none" }}>
        <pre>{JSON.stringify(glossaryItem, null, 2)}</pre>
      </div>

      {images[0] ? (
        <img
          src={images[0]}
          alt={hdr.glossaryName || hdr.title || "Glossary"}
          className="w-full h-80 object-cover rounded-xl shadow"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/no-image.png";
          }}
        />
      ) : (
        <div className="w-full h-80 bg-gray-200 rounded-xl flex items-center justify-center">
          <span className="text-gray-500">No image available</span>
        </div>
      )}

      <h1 className="text-3xl font-bold text-center mt-6">
        {hdr.glossaryName || hdr.title || "Untitled Glossary"}
      </h1>

      {(hdr.glossaryDescription || hdr.description) && (
        <p className="text-gray-700 text-center mt-4 leading-relaxed">
          {hdr.glossaryDescription || hdr.description}
        </p>
      )}

      <div className="bg-white shadow rounded-xl p-6 mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">Venue</h3>
          <p className="text-gray-600 mt-2">
            {hdr.address || hdr.city || hdr.venue || "Not specified"}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg text-gray-800">Date</h3>
          <p className="text-gray-600 mt-2">
            {formattedDate || "Not specified"}
          </p>
        </div>
      </div>

      {(hdr.glossaryDescription2 || hdr.additionalInfo) && (
        <div className="mt-8 p-6 bg-blue-50 rounded-xl">
          <h3 className="font-semibold text-xl mb-3 text-gray-800">
            Additional Information
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {hdr.glossaryDescription2 || hdr.additionalInfo}
          </p>
        </div>
      )}

      {highlights.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Key Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {highlights.map((h, index) => (
              <div
                key={index}
                className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow hover:shadow-md transition"
              >
                <h4 className="font-bold text-lg text-gray-800 mb-2">
                  {h.title || `Highlight ${index + 1}`}
                </h4>
                <p className="text-gray-700">{h.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length > 1 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.slice(1).map((img: any, index: any) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-xl shadow hover:shadow-lg transition"
              >
                <img
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/no-image.png";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow">
        <h3 className="font-semibold text-xl mb-6 text-gray-800">
          Location Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hdr.address && (
            <div className="p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-700">Address:</span>
              <p className="text-gray-600 mt-1">{hdr.address}</p>
            </div>
          )}

          {hdr.city && (
            <div className="p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-700">City:</span>
              <p className="text-gray-600 mt-1">{hdr.city}</p>
            </div>
          )}

          {hdr.state && (
            <div className="p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-700">State:</span>
              <p className="text-gray-600 mt-1">{hdr.state}</p>
            </div>
          )}

          {hdr.country && (
            <div className="p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-700">Country:</span>
              <p className="text-gray-600 mt-1">{hdr.country}</p>
            </div>
          )}

          {hdr.pin && (
            <div className="p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-700">PIN Code:</span>
              <p className="text-gray-600 mt-1">{hdr.pin}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlossaryDetail;
