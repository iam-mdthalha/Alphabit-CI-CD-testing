import React from "react";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

type Props = {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const iconStyle: React.CSSProperties = {
  fontSize: 18,
  cursor: "pointer",
};

const EventsActions: React.FC<Props> = ({ onView, onEdit, onDelete }) => {
  return (
    <div style={{ display: "flex", gap: 14 }}>
         <EyeOutlined
           style={{ ...iconStyle, color: "#1890ff" }}
           onClick={onEdit}
         />
   
         <EditOutlined
           style={{ ...iconStyle, color: "#52c41a" }}
           onClick={onEdit}
         />
   
         <DeleteOutlined
           style={{ ...iconStyle, color: "#ff4d4f" }}
           onClick={onDelete}
         />
       </div>
  );
};

export default EventsActions;
