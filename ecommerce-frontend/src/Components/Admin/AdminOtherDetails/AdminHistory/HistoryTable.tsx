import React from "react";
import type { AdminHistory } from "../../../../Types/Admin/AdminHistoryType";
import HistoryActions from "./HistoryActions";

type Props = {
  items: AdminHistory[];
  onEdit: (item: AdminHistory) => void;
  onDelete: (id: number) => void;
};

const tableCardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e6e6e6",
  padding: 16,
  borderRadius: 6,
};

const thumbnailStyle: React.CSSProperties = {
  width: 80,
  height: 60,
  objectFit: "cover",
  borderRadius: 4,
  border: "1px solid #eee",
};

const HistoryTable: React.FC<Props> = ({ items, onEdit, onDelete }) => {
  return (
    <div style={tableCardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4 style={{ margin: 0 }}>History</h4>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
        <thead>
          <tr style={{ textAlign: "left", color: "#666", fontSize: 13 }}>
            <th style={{ padding: "10px 8px", width: 160 }}>Year</th>
            <th style={{ padding: "10px 8px" }}>Title & Description</th>
            <th style={{ padding: "10px 8px", width: 140 }}>Image</th>
            <th style={{ padding: "10px 8px", width: 160 }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: 16 }}>
                No history entries found.
              </td>
            </tr>
          ) : (
            items.map((it) => (
              <tr key={it.id} style={{ borderTop: "1px solid #f0f0f0" }}>
                {/* YEAR */}
                <td style={{ padding: "12px 8px", verticalAlign: "top" }}>
                  {it.year}
                </td>

                {/* TITLE + DESCRIPTION */}
                <td style={{ padding: "12px 8px", verticalAlign: "top" }}>
                  <div style={{ fontWeight: 500 }}>{it.title}</div>

                  {/* Description preview */}
                  {it.description1 && (
                    <div style={{ color: "#888", marginTop: 6, fontSize: 13 }}>
                      {it.description1.length > 80
                        ? it.description1.slice(0, 80) + "…"
                        : it.description1}
                    </div>
                  )}
                </td>

                {/* IMAGE PREVIEW */}
                <td style={{ padding: "12px 8px", verticalAlign: "top" }}>
                  {it.imageUrl ? (
                    <img
                      src={it.imageUrl}
                      alt={it.title}
                      style={thumbnailStyle}
                    />
                  ) : (
                    <div style={{ color: "#999", fontSize: 13 }}>No image</div>
                  )}
                </td>

                {/* ACTION BUTTONS */}
                <td style={{ padding: "12px 8px", verticalAlign: "top" }}>
                  <HistoryActions
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
  );
};

export default HistoryTable;
