import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import { useGetAllHistoryQuery } from "Services/HistoryApiSlice";
import type { AdminHistory } from "Types/Admin/AdminHistoryType";

const HistoryTimeline: React.FC = () => {
  const navigate = useNavigate();
  const plant = process.env.REACT_APP_PLANT ?? "";

  const {
    data: historyItems = [],
    isLoading,
    isError,
  } = useGetAllHistoryQuery({ plant });

  useEffect(() => {
    AOS.init({ once: true, duration: 800 });
  }, []);

  
  const sortedHistory = useMemo(() => {
    return [...historyItems].sort(
      (a: AdminHistory, b: AdminHistory) => a.year - b.year
    );
  }, [historyItems]);

  if (isLoading) {
    return (
      <section className="w-full h-full bg-white">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Loading timeline…</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full h-full bg-white">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-600">Failed to load timeline.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white">
      {/* HEADER */}
      <div className="relative w-full h-[60vh] md:h-[75vh] bg-cover bg-center"
        style={{
          backgroundImage: `url('/template4/History/history-main.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif mb-4" data-aos="fade-down">
            A History Like No Other
          </h1>
          <p className="max-w-2xl text-sm md:text-base" data-aos="fade-up">
            Short stories and recounts from the earliest beginnings and
            evolution of Moore Market.
          </p>

          <button
            onClick={() => navigate("/history")}
            className="mt-6 px-6 py-2 bg-white text-black rounded-full text-sm"
            data-aos="fade-up"
          >
            Discover More
          </button>
        </div>
      </div>

      {/* TIMELINE LIST */}
      <div className="px-6 md:px-20 py-16 md:py-24">
        <h2 className="text-2xl md:text-3xl font-serif mb-12">Browse Our Timeline</h2>

        <div className="relative border-l border-gray-300 ml-4 md:ml-10">
          {sortedHistory.length === 0 ? (
            <p className="text-gray-500">No history available.</p>
          ) : (
            sortedHistory.map((item, index) => (
              <div
                key={item.id}
                className="mb-12 ml-4 cursor-pointer group"
                onClick={() => navigate(`/history/${item.id}`)}
                data-aos="fade-up"
              >
                <div className="absolute -left-2.5 w-4 h-4 bg-black rounded-full border border-white"></div>

                <h3 className="text-xl font-semibold text-black">{item.year}</h3>
                <p className="text-sm text-gray-700 mt-2">{item.title}</p>

                {item.description1 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {item.description1.slice(0, 120)}…
                  </p>
                )}

                {/* IMAGE */}
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-56 h-36 object-cover mt-4 rounded shadow-sm group-hover:scale-[1.03] transition"
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default HistoryTimeline;
