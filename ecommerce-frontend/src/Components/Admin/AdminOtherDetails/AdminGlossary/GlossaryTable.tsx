import React from "react";
import GlossaryActions from "./GlossaryActions";
import { Glossary } from "Types/Admin/AdminGlossaryType";

type Props = {
  items: Glossary[];
  onView: (item: Glossary) => void;
  onEdit: (item: Glossary) => void;
  onDelete: (id: number) => void;
};

const GlossaryTable: React.FC<Props> = ({
  items,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between"></div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Venue
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Images
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No glossary records found.
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr key={it.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 align-top w-1/6 text-gray-800">
                    {it.date}
                  </td>

                  <td className="px-4 py-4 align-top w-1/6 text-gray-800">
                    {it.title}
                  </td>

                  <td className="px-4 py-4 align-top w-2/6 text-gray-700">
                    {it.address}, {it.city}, {it.state}
                  </td>

                  <td className="px-4 py-4 align-top w-1/6 text-gray-700">
                    {it.imagesPreviewUrls?.length > 0
                      ? `${it.imagesPreviewUrls.length} images`
                      : "No images"}
                  </td>

                  <td className="px-4 py-4 align-top w-28">
                    <GlossaryActions
                      onView={() => onView(it)}
                      onEdit={() => onEdit(it)}
                      onDelete={() => onDelete(it.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GlossaryTable;
