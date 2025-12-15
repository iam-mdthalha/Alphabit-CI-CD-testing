import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

export interface ChromaItem {
  image: string;
  title: string;
  desc: string;
  desc2?: string;
  location?: string;
  borderColor?: string;
  gradient?: string;
  id?: string;
}

export interface ChromaGridProps {
  items?: ChromaItem[];
  className?: string;
  radius?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
  onItemClick?: (item: ChromaItem) => void;
  basePath?: string;
}

type SetterFn = (v: number | string) => void;

const ShimmerCard: React.FC = () => (
  <div className="group relative flex flex-col w-[300px] rounded-[20px] overflow-hidden border-2 border-transparent bg-vintageBg/50">
    <div className="relative z-10 flex-1 p-[10px] box-border">
      <div className="w-full h-full rounded-[10px] overflow-hidden bg-gray-200 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer bg-[length:200%_100%]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/30 to-transparent animate-shimmer-overlay" />
        </div>

        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-gray-50 via-transparent to-gray-50" />
      </div>
    </div>
    <footer className="relative z-10 p-3 text-vintageText font-sans grid grid-cols-1 gap-x-3 gap-y-1">
      <div className="w-full text-center mb-2">
        <div className="h-5 bg-gray-300 rounded-md mx-auto w-3/4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer bg-[length:200%_100%]" />
        </div>
      </div>
      <div className="w-full text-center">
        <div className="h-4 bg-gray-300 rounded-md mx-auto w-5/6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer bg-[length:200%_100%]" />
        </div>
      </div>
    </footer>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center w-full h-64 md:h-80 text-vintageText/70">
    <div className="text-6xl mb-4">🎨</div>
    <h3 className="text-xl font-semibold mb-2">No items to display</h3>
    <p className="text-center max-w-md">
      There are currently no items. Check back later to get started.
    </p>
  </div>
);

const ChromaGrid: React.FC<ChromaGridProps> = ({
  items,
  className = "",
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
  onItemClick,
  basePath = "/gallery",
}) => {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<SetterFn | null>(null);
  const setY = useRef<SetterFn | null>(null);
  const pos = useRef({ x: 0, y: 0 });
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const data = items || [];

  useEffect(() => {
    if (data.length === 0) {
      setImagesLoaded(true);
      return;
    }

    const preloadImages = async () => {
      const imagePromises = data.map((item) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = item.image;
          img.onload = img.onerror = () => resolve();
        });
      });

      await Promise.all(imagePromises);
      setImagesLoaded(true);
    };

    preloadImages();
  }, [data]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px") as SetterFn;
    setY.current = gsap.quickSetter(el, "--y", "px") as SetterFn;
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdesc2: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e: React.PointerEvent) => {
    const r = rootRef.current!.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardClick = (item: ChromaItem) => {
    if (onItemClick) {
      onItemClick(item);
    } else {
      navigate(`${basePath}/${item.id || "view"}`, { state: { item } });
    }
  };

  const handleCardMove: React.MouseEventHandler<HTMLElement> = (e) => {
    const c = e.currentTarget as HTMLElement;
    const rect = c.getBoundingClientRect();
    c.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    c.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={rootRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`relative w-full h-full flex flex-wrap justify-center items-start gap-3 ${className} p-12 bg-vintageBg`}
      style={
        {
          "--r": `${radius}px`,
          "--x": "50%",
          "--y": "50%",
        } as React.CSSProperties
      }
    >
      {!imagesLoaded &&
        data.length > 0 &&
        Array.from({ length: data.length }).map((_, index) => (
          <ShimmerCard key={`shimmer-${index}`} />
        ))}

      {imagesLoaded && data.length === 0 && <EmptyState />}

      {imagesLoaded &&
        data.length > 0 &&
        data.map((c, i) => (
          <article
            key={i}
            onMouseMove={handleCardMove}
            onClick={() => handleCardClick(c)}
            className="group relative flex flex-col w-[300px] rounded-[20px] overflow-hidden border-2 border-transparent transition-colors duration-300 cursor-pointer bg-white shadow-sm"
            style={
              {
                "--card-border": c.borderColor || "transparent",
                background: c.gradient,
                "--spotlight-color": "rgba(139, 69, 19, 0.1)",
              } as React.CSSProperties
            }
          >
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)",
              }}
            />
            <div className="relative z-10 flex-1 p-[10px] box-border">
              <img
                src={c.image}
                alt={c.title}
                loading="lazy"
                className="w-full h-full object-cover rounded-[10px]"
              />
            </div>
            <footer className="relative z-10 p-3 text-white tracking-wider grid grid-cols-1 gap-x-3 gap-y-1">
              <h3 className="w-full text-center m-0 text-[1.05rem] font-semibold font-melodramaRegular">
                {c.title}
              </h3>
              <p className="w-full text-center m-0 text-[0.85rem] opacity-85 font-gilroyRegular">
                {c.desc}
              </p>
              <p className="w-full text-end m-0 pt-2 text-[0.65rem] opacity-95 font-gilroyRegular">
                {c.desc2}
              </p>
            </footer>
          </article>
        ))}

      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          backdropFilter: "brightness(1)",
          WebkitBackdropFilter: "brightness(1)",
          background: "rgba(255,255,255,0.001)",
          maskImage:
            "radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22)45%,rgba(0,0,0,0.35)60%,rgba(0,0,0,0.50)75%,rgba(0,0,0,0.68)88%,white 100%)",
          WebkitMaskImage:
            "radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22)45%,rgba(0,0,0,0.35)60%,rgba(0,0,0,0.50)75%,rgba(0,0,0,0.68)88%,white 100%)",
        }}
      />
      <div
        ref={fadeRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-[250ms] z-40"
        style={{
          backdropFilter: "brightness(1.1)",
          WebkitBackdropFilter: "brightness(1.1)",
          background: "rgba(255,255,255,0.001)",
          maskImage:
            "radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)",
          opacity: 1,
          scale: 105,
        }}
      />
    </div>
  );
};

export default ChromaGrid;
