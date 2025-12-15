import React from "react";
import { useNavigate } from "react-router-dom";

import GlossaryTable from "Components/Admin/AdminOtherDetails/AdminGlossary/GlossaryTable";
import { Glossary } from "Types/Admin/AdminGlossaryType";
import {
  useGetAllGlossaryQuery,
  useDeleteGlossaryMutation,
} from "Services/GlossaryApiSlice";

const AdminGlossary: React.FC = () => {
  const navigate = useNavigate();
  const plant = process.env.REACT_APP_PLANT || "";

  const { data, isLoading, isError, refetch } = useGetAllGlossaryQuery({
    plant,
    search: "",
  });

  const [deleteGlossary] = useDeleteGlossaryMutation();

  console.log("API data:", data);

  const items: Glossary[] =
    (data as any)?.results?.map((result: any) => {
      const hdr = result.glossaryHdr || {};

      return {
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
          result.glossaryDetList?.map((det: any) => det.glossaryImage) || [],
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
      };
    }) ?? [];

  console.log("Mapped items:", items);

  const handleView = (item: Glossary) => {
    navigate(`/admin/other-details/glossary/edit/${item.id}`, {
      state: { item, mode: "view" as const },
    });
  };

  const handleEdit = (item: Glossary) => {
    navigate(`/admin/other-details/glossary/edit/${item.id}`, {
      state: { item, mode: "edit" as const },
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this glossary entry?")) return;

    try {
      await deleteGlossary({ id, plant }).unwrap();
      alert("Glossary deleted successfully");
      refetch();
    } catch (err) {
      console.error("Delete error", err);
      alert("Failed to delete glossary");
    }
  };

  const handleAdd = () => {
    navigate("/admin/other-details/glossary/add");
  };

  return (
    <div className="px-8 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium">Glossary</h3>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white text-sm px-3 py-1 rounded shadow"
        >
          + Add Glossary
        </button>
      </div>

      {isLoading && <p>Loading glossary…</p>}
      {isError && (
        <p className="text-red-500">
          Failed to load glossary. Please try again.
        </p>
      )}

      {!isLoading && !isError && (
        <GlossaryTable
          items={items}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AdminGlossary;
