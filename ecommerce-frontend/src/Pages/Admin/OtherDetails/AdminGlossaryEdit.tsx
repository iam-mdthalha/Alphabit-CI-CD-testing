import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GlossaryForm from "Components/Admin/AdminOtherDetails/AdminGlossary/GlossaryForm";
import { Glossary } from "Types/Admin/AdminGlossaryType";
import {
  useGetGlossaryByIdQuery,
  useUpdateGlossaryMutation,
} from "Services/GlossaryApiSlice";

type LocationState = {
  item?: Glossary;
  mode?: "view" | "edit";
};

const AdminGlossaryEdit: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const plant = process.env.REACT_APP_PLANT || "";

  const state = (location.state || {}) as LocationState;
  const initialItem = state.item ?? null;

  const [formItem, setFormItem] = useState<Glossary | null>(initialItem);

  const { data, isLoading, isError } = useGetGlossaryByIdQuery(
    { id: Number(id), plant },
    { skip: !id }
  );

  const [updateGlossary] = useUpdateGlossaryMutation();

  useEffect(() => {
    if (initialItem || !data) return;

    const result = (data as any)?.results?.[0];
    if (!result) return;

    const hdr = result.glossaryHdr || {};

    const mapped: Glossary = {
      id: hdr.id,
      date: hdr.glossaryDate
        ? new Date(hdr.glossaryDate).toLocaleDateString("en-GB")
        : "",
      title: hdr.glossaryName || "",
      venue: hdr.address || hdr.city || "",

      address: hdr.address || "",
      city: hdr.city || "",
      state: hdr.state || "",
      country: hdr.country || "",
      pin: hdr.pin || "",

      imagesPreviewUrls:
        result.glossaryDetList?.map((d: any) => d.glossaryImage) ?? [],
      highlightTitle1: hdr.section1Title || "",
      highlightDesc1: hdr.section1Description || "",
      highlightTitle2: hdr.section2Title || "",
      highlightDesc2: hdr.section2Description || "",
      highlightTitle3: hdr.section3Title || "",
      highlightDesc3: hdr.section3Description || "",
      highlightTitle4: hdr.section4Title || "",
      highlightDesc4: hdr.section4Description || "",
      highlightTitle5: hdr.section5Title || "",
      highlightDesc5: hdr.section5Description || "",
      highlightTitle6: hdr.section6Title || "",
      highlightDesc6: hdr.section6Description || "",
      highlightTitle7: hdr.section7Title || "",
      highlightDesc7: hdr.section7Description || "",
      highlightTitle8: hdr.section8Title || "",
      highlightDesc8: hdr.section8Description || "",
    } as Glossary;

    setFormItem(mapped);
  }, [data, initialItem]);

  const handleSave = async (formData: FormData) => {
    try {
      const dataStr = formData.get("data") as string | null;
      let json: any = {};

      if (dataStr) {
        try {
          json = JSON.parse(dataStr);
        } catch (e) {
          console.error("Failed to parse glossary JSON from formData", e);
        }
      }

      if (json) {
        const keyHighlights = [
          {
            title: json.section1Title || "",
            description: json.section1Description || "",
          },
          {
            title: json.section2Title || "",
            description: json.section2Description || "",
          },
          {
            title: json.section3Title || "",
            description: json.section3Description || "",
          },
          {
            title: json.section4Title || "",
            description: json.section4Description || "",
          },
          {
            title: json.section5Title || "",
            description: json.section5Description || "",
          },
          {
            title: json.section6Title || "",
            description: json.section6Description || "",
          },
          {
            title: json.section7Title || "",
            description: json.section7Description || "",
          },
          {
            title: json.section8Title || "",
            description: json.section8Description || "",
          },
        ].filter((item) => item.title || item.description);

        delete json.section1Title;
        delete json.section1Description;
        delete json.section2Title;
        delete json.section2Description;
        delete json.section3Title;
        delete json.section3Description;
        delete json.section4Title;
        delete json.section4Description;
        delete json.section5Title;
        delete json.section5Description;
        delete json.section6Title;
        delete json.section6Description;
        delete json.section7Title;
        delete json.section7Description;
        delete json.section8Title;
        delete json.section8Description;

        json.keyHighlights = keyHighlights;
        json.id = Number(id);
        json.plant = plant;
      }

      formData.set("data", JSON.stringify(json));

      await updateGlossary(formData).unwrap();
      alert("Glossary updated successfully");
      navigate("/admin/other-details/glossary");
    } catch (err) {
      console.error("Update error", err);
      alert("Failed to update glossary");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoading && !formItem) {
    return (
      <div className="px-8 pt-6">
        <p>Loading glossary…</p>
      </div>
    );
  }

  if (isError && !formItem) {
    return (
      <div className="px-8 pt-6">
        <p className="text-red-500">Failed to load glossary details.</p>
      </div>
    );
  }

  return (
    <div className="px-8 pt-6">
      <GlossaryForm
        item={formItem}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AdminGlossaryEdit;
