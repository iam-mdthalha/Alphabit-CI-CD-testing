import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import { useGetAllHistoryQuery } from "Services/HistoryApiSlice";
import type { AdminHistory } from "Types/Admin/AdminHistoryType";

const HistoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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

 
  const sorted = useMemo(() => {
    return [...historyItems].sort(
      (a: AdminHistory, b: AdminHistory) => a.year - b.year
    );
  }, [historyItems]);

 
  const { story, index, total } = useMemo(() => {
    if (!sorted || sorted.length === 0) {
      return { story: undefined, index: 0, total: 0 };
    }

    const targetId = id ? Number(id) : sorted[0].id;

    const idx = sorted.findIndex((s) => s.id === targetId);

    return {
      story: sorted[idx >= 0 ? idx : 0],
      index: idx >= 0 ? idx : 0,
      total: sorted.length,
    };
  }, [sorted, id]);

  if (isLoading) {
    return (
      <section className="w-full h-full bg-white">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Loading history…</p>
        </div>
      </section>
    );
  }

  if (isError || !story) {
    return (
      <section className="w-full h-full bg-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              Failed to load this story. Please go back to the timeline.
            </p>
            <button
              onClick={() => navigate("/history-timeline")}
              className="px-4 py-2 bg-black text-white rounded-full text-sm"
            >
              Back to all stories
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Background position based on story index
  const bgPosition =
    total <= 1 ? "50%" : `${Math.round((index * 100) / (total - 1))}%`;

  const description = [story.description1, story.description2, story.description3]
    .filter(Boolean)
    .join("\n\n");

  // NAVIGATION
  const currentIndex = index;

  const goPrev = () => {
    const prevIndex =
      currentIndex <= 0 ? sorted.length - 1 : currentIndex - 1;
    navigate(`/history/${sorted[prevIndex].id}`);
  };

  const goNext = () => {
    const nextIndex =
      currentIndex >= sorted.length - 1 ? 0 : currentIndex + 1;
    navigate(`/history/${sorted[nextIndex].id}`);
  };

  return (
    <section className="w-full h-full bg-white">
      <div className="flex flex-col md:flex-row w-full min-h-screen">
        {/* LEFT PANEL */}
        <div
          className="w-full md:w-[45%] bg-vintageBg px-8 sm:px-12 lg:px-20 py-16 md:py-24"
          data-aos="fade-right"
        >
          <button
            onClick={() => navigate("/history-timeline")}
            className="text-sm uppercase underline mb-10 cursor-pointer tracking-wide"
          >
            Back to all stories
          </button>

          <h1 className="text-5xl md:text-6xl font-serif mb-6 text-[#222]">
            {story.year}
          </h1>

          <h2 className="uppercase text-xs tracking-wider text-[#444] mb-8">
            {story.title}
          </h2>

          <div className="text-[15px] leading-relaxed text-[#333] whitespace-pre-line">
            {description || "No description available."}
          </div>

          <div className="flex gap-4 mt-12">
            <button
              onClick={goPrev}
              className="w-10 h-10 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition"
            >
              ←
            </button>
            <button
              onClick={goNext}
              className="w-10 h-10 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition"
            >
              →
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: IMAGE STRIP */}
        <div
          className="w-full md:w-[55%] min-h-[50vh] md:min-h-screen bg-cover bg-no-repeat bg-center"
          data-aos="fade-left"
          style={{
            backgroundImage: `url('/template4/History/history-timeline.png')`,
            backgroundPosition: `${bgPosition} center`,
            backgroundSize: "400% auto",
          }}
        ></div>
      </div>
    </section>
  );
};

export default HistoryDetail;
