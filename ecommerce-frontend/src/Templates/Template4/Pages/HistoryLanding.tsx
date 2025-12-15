import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import { useGetAllHistoryQuery } from "Services/HistoryApiSlice";
import type { AdminHistory } from "Types/Admin/AdminHistoryType";

const HistoryLanding: React.FC = () => {
  const navigate = useNavigate();
  const plant = process.env.REACT_APP_PLANT ?? "";

  const {
    data: historyItems = [],
    isLoading,
    isError,
  } = useGetAllHistoryQuery({ plant });

  useEffect(() => {
    AOS.init({ once: true, duration: 900 });
  }, []);

  /** Sort stories by year ASC */
  const sorted = [...historyItems].sort(
    (a: AdminHistory, b: AdminHistory) => a.year - b.year
  );

  /** First story for landing preview */
  const featured = sorted.length > 0 ? sorted[0] : undefined;

  if (isLoading) {
    return (
      <section className="w-full h-full bg-white">
        <div className="min-h-screen flex justify-center items-center">
          <p className="text-gray-600">Loading history…</p>
        </div>
      </section>
    );
  }

  if (isError || !featured) {
    return (
      <section className="w-full h-full bg-white">
        <div className="min-h-screen flex justify-center items-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              Unable to load the history timeline right now.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-black text-white rounded-full text-sm"
            >
              Go Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-full">
      {/* HERO BACKGROUND */}
      <div
        className="w-full h-[85vh] bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `url("/template4/History/history-landing.jpg")`,
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div
          data-aos="fade-up"
          className="absolute inset-0 flex flex-col justify-center px-10 md:px-24 text-white"
        >
          <h1 className="text-5xl md:text-7xl font-serif mb-6">
            A History Like No Other.
          </h1>

          <p className="text-lg md:text-xl max-w-xl leading-relaxed mb-10">
            Short stories and recounts from the very first voyages through the
            modern day and the rebirth of Moore Market as it is today.
          </p>

          <button
            onClick={() => navigate("/history-timeline")}
            className="bg-white text-black px-6 py-3 rounded-full text-sm font-semibold shadow hover:bg-gray-200 transition"
          >
            Discover More
          </button>
        </div>
      </div>

      {/* FEATURED STORY PREVIEW */}
      <div className="px-10 md:px-24 py-16 bg-white" data-aos="fade-up">
        <h2 className="text-3xl font-serif mb-4">Featured Story</h2>

        <p className="uppercase text-xs tracking-wide text-gray-600">
          {featured.year}
        </p>

        <h3 className="text-2xl font-semibold mb-3">{featured.title}</h3>

        <p className="text-gray-700 max-w-3xl leading-relaxed mb-6">
          {featured.description1?.slice(0, 180) ?? "No description available."}
          {featured.description1 && featured.description1.length > 180 ? "…" : ""}
        </p>

        <button
          onClick={() => navigate(`/history/${featured.id}`)}
          className="underline text-sm tracking-wide hover:text-black transition"
        >
          Read Full Story →
        </button>
      </div>
    </section>
  );
};

export default HistoryLanding;
