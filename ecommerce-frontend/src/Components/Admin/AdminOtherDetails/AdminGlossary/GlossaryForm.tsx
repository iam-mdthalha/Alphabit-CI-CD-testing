import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Glossary } from "Types/Admin/AdminGlossaryType";

type Props = {
  item?: Glossary | null;
  onSave: (payload: FormData) => Promise<void>;
  onCancel: () => void;
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e6e6e6",
  padding: 16,
  borderRadius: 6,
};

const fieldStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "8px 10px",
  borderRadius: 4,
  border: "1px solid #d9d9d9",
  boxSizing: "border-box",
};

const venueOptions = [
  {
    address: "Grand Mall, 137, Velachery Main Rd, Velachery, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    pin: "600042",
  },
  {
    address: "DLF IT Park, Mount Poonamallee Rd, Nandambakkam Post",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    pin: "600089",
  },
  {
    address: "Marina Mall, Old Mahabalipuram Road, Egattur",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    pin: "603103",
  },
  {
    address: "Industrial Area, Riyadh",
    city: "Riyadh",
    state: "Central Province",
    country: "Saudi Arabia",
    pin: "11564",
  },
];

const TOTAL_SLOTS = 6;

const GlossaryForm: React.FC<Props> = ({ item = null, onSave, onCancel }) => {
  const [date, setDate] = useState<string>(
    item?.date ? dayjs(item.date, "DD/MM/YYYY").format("YYYY-MM-DD") : ""
  );
  const [title, setTitle] = useState<string>(item?.title ?? "");

  const [address, setAddress] = useState<string>(item?.address ?? "");
  const [city, setCity] = useState<string>(item?.city ?? "");
  const [state, setState] = useState<string>(item?.state ?? "");
  const [country, setCountry] = useState<string>(item?.country ?? "");
  const [pin, setPin] = useState<string>(item?.pin ?? "");
  const [venue, setVenue] = useState<string>(item?.venue ?? "");

  const [imageFiles, setImageFiles] = useState<File[]>(item?.imageFiles ?? []);
  const [imagesPreviewUrls, setImagesPreviewUrls] = useState<string[]>(
    item?.imagesPreviewUrls ?? []
  );

  const [highlightTitle1, setHighlightTitle1] = useState<string>(
    item?.highlightTitle1 ?? ""
  );
  const [highlightDesc1, setHighlightDesc1] = useState<string>(
    item?.highlightDesc1 ?? ""
  );
  const [highlightTitle2, setHighlightTitle2] = useState<string>(
    item?.highlightTitle2 ?? ""
  );
  const [highlightDesc2, setHighlightDesc2] = useState<string>(
    item?.highlightDesc2 ?? ""
  );
  const [highlightTitle3, setHighlightTitle3] = useState<string>(
    item?.highlightTitle3 ?? ""
  );
  const [highlightDesc3, setHighlightDesc3] = useState<string>(
    item?.highlightDesc3 ?? ""
  );
  const [highlightTitle4, setHighlightTitle4] = useState<string>(
    item?.highlightTitle4 ?? ""
  );
  const [highlightDesc4, setHighlightDesc4] = useState<string>(
    item?.highlightDesc4 ?? ""
  );
  const [highlightTitle5, setHighlightTitle5] = useState<string>(
    item?.highlightTitle5 ?? ""
  );
  const [highlightDesc5, setHighlightDesc5] = useState<string>(
    item?.highlightDesc5 ?? ""
  );
  const [highlightTitle6, setHighlightTitle6] = useState<string>(
    item?.highlightTitle6 ?? ""
  );
  const [highlightDesc6, setHighlightDesc6] = useState<string>(
    item?.highlightDesc6 ?? ""
  );
  const [highlightTitle7, setHighlightTitle7] = useState<string>(
    item?.highlightTitle7 ?? ""
  );
  const [highlightDesc7, setHighlightDesc7] = useState<string>(
    item?.highlightDesc7 ?? ""
  );
  const [highlightTitle8, setHighlightTitle8] = useState<string>(
    item?.highlightTitle8 ?? ""
  );
  const [highlightDesc8, setHighlightDesc8] = useState<string>(
    item?.highlightDesc8 ?? ""
  );

  const [error, setError] = useState<string>("");

  const handleVenueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = e.target.selectedIndex - 1;
    if (selectedIndex >= 0 && selectedIndex < venueOptions.length) {
      const selectedVenue = venueOptions[selectedIndex];
      setAddress(selectedVenue.address);
      setCity(selectedVenue.city);
      setState(selectedVenue.state);
      setCountry(selectedVenue.country);
      setPin(selectedVenue.pin);

      setVenue(
        `${selectedVenue.address}, ${selectedVenue.city}, ${selectedVenue.state}`
      );
    } else {
      setAddress("");
      setCity("");
      setState("");
      setCountry("");
      setPin("");
      setVenue("");
    }
  };

  useEffect(() => {
    const previews = imageFiles.map((file) => URL.createObjectURL(file));
    setImagesPreviewUrls(previews);

    return () => previews.forEach((p) => URL.revokeObjectURL(p));
  }, [imageFiles]);

  function handleFileChange(slotIndex: number, file?: File | null) {
    setError("");

    setImageFiles((prev) => {
      const copy = [...prev];
      copy[slotIndex] = file ?? (null as any);
      return copy.filter(Boolean);
    });
  }

  async function validateAndSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (imageFiles.length < 5) {
      setError("Please upload at least 5 images before submitting.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const formattedDate = date
      ? dayjs(date).format("DD/MM/YYYY")
      : dayjs().format("DD/MM/YYYY");

    const keyHighlights = [
      { title: highlightTitle1, description: highlightDesc1 },
      { title: highlightTitle2, description: highlightDesc2 },
      { title: highlightTitle3, description: highlightDesc3 },
      { title: highlightTitle4, description: highlightDesc4 },
      { title: highlightTitle5, description: highlightDesc5 },
      { title: highlightTitle6, description: highlightDesc6 },
      { title: highlightTitle7, description: highlightDesc7 },
      { title: highlightTitle8, description: highlightDesc8 },
    ].filter((item) => item.title || item.description);

    const jsonData = {
      plant: process.env.REACT_APP_PLANT,

      glossaryName: title,
      glossaryDescription: highlightDesc1,
      glossaryDescription2: highlightDesc2,

      glossaryDate: formattedDate,

      address: address,
      city: city,
      state: state,
      country: country,
      pin: pin,

      section1Title: highlightTitle1,
      section1Description: highlightDesc1,
      section2Title: highlightTitle2,
      section2Description: highlightDesc2,
      section3Title: highlightTitle3,
      section3Description: highlightDesc3,
      section4Title: highlightTitle4,
      section4Description: highlightDesc4,
      section5Title: highlightTitle5,
      section5Description: highlightDesc5,
      section6Title: highlightTitle6,
      section6Description: highlightDesc6,
      section7Title: highlightTitle7,
      section7Description: highlightDesc7,
      section8Title: highlightTitle8,
      section8Description: highlightDesc8,
    };

    console.log("Submitting JSON:", jsonData);

    const formData = new FormData();
    formData.append("data", JSON.stringify(jsonData));

    imageFiles.forEach((file) => {
      formData.append("file", file);
    });

    await onSave(formData);
  }

  return (
    <>
      <button
        type="button"
        onClick={onCancel}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          marginBottom: 12,
        }}
      >
        ← Back
      </button>

      <h3 className="text-base font-medium" style={{ marginBottom: 12 }}>
        {item ? "Edit Glossary" : "Add Glossary"}
      </h3>

      <form onSubmit={validateAndSubmit} style={cardStyle}>
        <div className="mb-3">
          <label style={{ display: "block", marginBottom: 6 }}>Date*</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={fieldStyle}
            required
          />
        </div>

        <div className="mb-3">
          <label style={{ display: "block", marginBottom: 6 }}>Title*</label>
          <input
            style={fieldStyle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            required
          />
        </div>

        <div className="mb-3">
          <label style={{ display: "block", marginBottom: 6 }}>Venue*</label>
          <select style={fieldStyle} onChange={handleVenueChange} required>
            <option value="">Select Venue</option>
            {venueOptions.map((v, index) => (
              <option key={index} value={v.address}>
                {v.address}, {v.city}, {v.state}, {v.country} - {v.pin}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label style={{ display: "block", marginBottom: 6 }}>Address</label>
          <input
            style={fieldStyle}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address will be filled from venue selection"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label style={{ display: "block", marginBottom: 6 }}>City</label>
            <input
              style={fieldStyle}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 6 }}>State</label>
            <input
              style={fieldStyle}
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label style={{ display: "block", marginBottom: 6 }}>Country</label>
            <input
              style={fieldStyle}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 6 }}>
              PIN Code
            </label>
            <input
              style={fieldStyle}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN Code"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Images <small>(minimum 5)</small>
          </label>

          <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(TOTAL_SLOTS)].map((_, i) => {
              const fileName = imageFiles[i]?.name ?? "No file chosen";
              const preview = imagesPreviewUrls[i];

              return (
                <div key={i}>
                  <label className="block text-sm text-gray-500 mb-1">
                    {i === 0
                      ? "Main Glossary Image"
                      : `Additional Glossary Image ${i}`}
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    onChange={(e) =>
                      handleFileChange(i, e.target.files?.[0] ?? null)
                    }
                  />

                  <div className="text-xs text-gray-500 mt-1">{fileName}</div>

                  {preview && (
                    <img
                      src={preview}
                      className="mt-2 w-36 h-24 object-cover rounded border"
                      alt={`preview-${i}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ ...cardStyle, padding: 12 }} className="mb-4">
          <div className="text-sm font-medium mb-3">Key Highlights</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Title 1</label>
              <input
                style={fieldStyle}
                value={highlightTitle1}
                onChange={(e) => setHighlightTitle1(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Description 1</label>
              <textarea
                style={{ ...fieldStyle, minHeight: 80 }}
                value={highlightDesc1}
                onChange={(e) => setHighlightDesc1(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Title 2</label>
              <input
                style={fieldStyle}
                value={highlightTitle2}
                onChange={(e) => setHighlightTitle2(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Description 2</label>
              <textarea
                style={{ ...fieldStyle, minHeight: 80 }}
                value={highlightDesc2}
                onChange={(e) => setHighlightDesc2(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Title 3</label>
              <input
                style={fieldStyle}
                value={highlightTitle3}
                onChange={(e) => setHighlightTitle3(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Description 3</label>
              <textarea
                style={{ ...fieldStyle, minHeight: 80 }}
                value={highlightDesc3}
                onChange={(e) => setHighlightDesc3(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Title 4</label>
              <input
                style={fieldStyle}
                value={highlightTitle4}
                onChange={(e) => setHighlightTitle4(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Description 4</label>
              <textarea
                style={{ ...fieldStyle, minHeight: 80 }}
                value={highlightDesc4}
                onChange={(e) => setHighlightDesc4(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Title 5</label>
              <input
                style={fieldStyle}
                value={highlightTitle5}
                onChange={(e) => setHighlightTitle5(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Description 5</label>
              <textarea
                style={{ ...fieldStyle, minHeight: 80 }}
                value={highlightDesc5}
                onChange={(e) => setHighlightDesc5(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Title 6</label>
              <input
                style={fieldStyle}
                value={highlightTitle6}
                onChange={(e) => setHighlightTitle6(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Description 6</label>
              <textarea
                style={{ ...fieldStyle, minHeight: 80 }}
                value={highlightDesc6}
                onChange={(e) => setHighlightDesc6(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Title 7</label>
              <input
                style={fieldStyle}
                value={highlightTitle7}
                onChange={(e) => setHighlightTitle7(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Description 7</label>
              <textarea
                style={{ ...fieldStyle, minHeight: 80 }}
                value={highlightDesc7}
                onChange={(e) => setHighlightDesc7(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Title 8</label>
              <input
                style={fieldStyle}
                value={highlightTitle8}
                onChange={(e) => setHighlightTitle8(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Description 8</label>
              <textarea
                style={{ ...fieldStyle, minHeight: 80 }}
                value={highlightDesc8}
                onChange={(e) => setHighlightDesc8(e.target.value)}
              />
            </div>
          </div>
        </div>

        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-white"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default GlossaryForm;
