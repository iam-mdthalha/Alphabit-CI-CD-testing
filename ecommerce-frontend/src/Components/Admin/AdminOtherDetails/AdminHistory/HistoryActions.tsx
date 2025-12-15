import React from "react";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

const iconStyle: React.CSSProperties = {
  fontSize: 18,
  cursor: "pointer",
};

const HistoryActions: React.FC<Props> = ({ onEdit, onDelete }) => {
  return (
    <div style={{ display: "flex", gap: 14 }}>
      {/* VIEW icon (like Product table) */}
      <EyeOutlined
        style={{ ...iconStyle, color: "#1890ff" }}
        onClick={onEdit}
      />

      {/* EDIT icon */}
      <EditOutlined
        style={{ ...iconStyle, color: "#52c41a" }}
        onClick={onEdit}
      />

      {/* DELETE icon */}
      <DeleteOutlined
        style={{ ...iconStyle, color: "#ff4d4f" }}
        onClick={onDelete}
      />
    </div>
  );
};

export default HistoryActions;
