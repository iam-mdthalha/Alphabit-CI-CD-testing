import React from "react";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";

const AnnouncementBar: React.FC = () => {
  const plant = process.env.REACT_APP_PLANT ?? "";

  const { data, isLoading } = useGetConfigurationByPlantQuery(plant);


  const shouldShow =
    data?.isBroadcastEnabled === true &&
    data?.broadcastMessage &&
    data.broadcastMessage.trim().length > 0;

  const message = data?.broadcastMessage?.trim() || "";

  if (isLoading) return null;
  if (!shouldShow) return null;

  return (
    <>
      <style>{`
        @keyframes scrollTextLeft {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        .announcement-container {
          width: 100%;
          background: #326638;
          color: #f5f2f2ff; 
          overflow: hidden;
          position: relative;
          height: 32px;
          display: flex;
          align-items: center;
        }
        .scroll-text-left {
          display: inline-block;
          white-space: nowrap;
          animation: scrollTextLeft 35s linear infinite;
          font-size: 14px;
          font-weight: 600;
          padding-right: 50px;
        }
      `}</style>

      <div className="announcement-container z-[999] relative">
        <div className="scroll-text-left">{message}</div>
      </div>
    </>
  );
};

export default AnnouncementBar;
