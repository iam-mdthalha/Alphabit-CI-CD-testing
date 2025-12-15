import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  // FaSearch,
  FaLocationArrow,
  FaTimes,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  MapContainer,
  TileLayer,
  useMap,
  Popup,
  ZoomControl,
  Marker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

type StoreLocation = {
  id: string;
  name: string;
  address: string;
  hours: string;
  coordinates: [number, number];
};

type GeoPoint = {
  coordinates: [number, number] | null;
  label: string | null;
};

const STORES: StoreLocation[] = [
  {
    id: "grand-mall-velachery",
    name: "Moore Market",
    address:
      "Grand Mall, 137, Velachery Main Rd, Velachery, Chennai, Tamil Nadu 600042",
    hours: "Mon-Sun: 10:00 AM - 10:00 PM",
    coordinates: [12.9812, 80.2206],
  },
  {
    id: "dlf-porur",
    name: "Moore Market",
    address:
      "DLF IT Park, Mount Poonamallee Rd, Nandambakkam Post, Ramapuram, Chennai, Tamil Nadu 600089",
    hours: "Mon-Sun: 10:00 AM - 10:00 PM",
    coordinates: [13.0333, 80.1765],
  },
  {
    id: "marina-mall-omr",
    name: "Moore Market",
    address:
      "Marina Mall, Old Mahabalipuram Road, Egattur, Chennai, Tamil Nadu 603103",
    hours: "Mon-Sun: 10:00 AM - 10:00 PM",
    coordinates: [12.8263, 80.2282],
  },
  {
    id: "skywalk-chennai",
    name: "Moore Market",
    address:
      "Ampa Skywalk, No: 1, Nelson Manickam Rd, Aminjikarai, Chennai, Tamil Nadu 600029",
    hours: "Mon-Sun: 10:00 AM - 10:00 PM",
    coordinates: [13.0704, 80.2203],
  },
  {
    id: "garuda-mall-bangalore",
    name: "Moore Market",
    address:
      "Garuda Mall, Magrath Rd, Ashok Nagar, Bengaluru, Karnataka 560025",
    hours: "Mon-Sun: 10:00 AM - 10:00 PM",
    coordinates: [12.9718, 77.6123],
  },
];

/* -------------------------------------------------- */
/* DISTANCE (Haversine) */
/* -------------------------------------------------- */
function haversineDistance(
  [lat1, lon1]: [number, number],
  [lat2, lon2]: [number, number]
) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* -------------------------------------------------- */
/* MAP VIEW CHANGE COMPONENT */
/* -------------------------------------------------- */
function ChangeView({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

/* -------------------------------------------------- */
/* CUSTOM MARKER ICON */
/* -------------------------------------------------- */
function createCircleIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:16px;height:16px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 0 2px rgba(0,0,0,0.4);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -9],
  });
}

/* -------------------------------------------------- */
/* CONTROLLED MARKER */
/* -------------------------------------------------- */
const ControlledMarker = ({
  position,
  icon,
  isSelected,
  store,
  onMarkerClick,
  isVisible,
}: {
  position: [number, number];
  icon: L.DivIcon;
  isSelected: boolean;
  store: StoreLocation;
  onMarkerClick: () => void;
  isVisible: boolean;
}) => {
  const markerRef = useRef<L.Marker>(null);
  const map = useMap();

  useEffect(() => {
    if (markerRef.current && isSelected) {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker && layer !== markerRef.current) {
          layer.closePopup();
        }
      });
      markerRef.current.openPopup();
    }
  }, [isSelected, map]);

  return (
    <Marker
      ref={markerRef}
      position={position}
      icon={icon}
      opacity={isVisible ? 1 : 0.4}
      eventHandlers={{ click: onMarkerClick }}
    >
      <Popup>
        <div className="min-w-[160px]">
          <p className="font-semibold text-sm">{store.name}</p>
          {!isVisible && (
            <p className="text-xs text-red-500 mt-1">Not matching your search</p>
          )}
          <p className="text-xs text-gray-600 mt-1">{store.address}</p>
          <p className="text-xs text-gray-500 mt-1">{store.hours}</p>
        </div>
      </Popup>
    </Marker>
  );
};

/* -------------------------------------------------- */
/* MAIN COMPONENT */
/* -------------------------------------------------- */
const StoreLocator = () => {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(STORES[0].id);

  const [searchPoint, setSearchPoint] = useState<GeoPoint>({
    coordinates: null,
    label: null,
  });

  const [currentPoint, setCurrentPoint] = useState<GeoPoint>({
    coordinates: null,
    label: null,
  });

  /* -------------------------------------------------- */
  /* FILTER STORES BASED ON SEARCH */
  /* -------------------------------------------------- */
  const filteredStores = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return STORES;

    return STORES.filter((s) =>
      `${s.name} ${s.address}`.toLowerCase().includes(q)
    );
  }, [query]);

  const mapCenter: [number, number] = useMemo(() => {
    if (filteredStores.length > 0)
      return filteredStores[0].coordinates;

    return STORES[0].coordinates;
  }, [filteredStores]);


  useEffect(() => {
    if (!query.trim()) {
      setSearchPoint({ coordinates: null, label: null });
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const url = `${NOMINATIM_URL}?q=${encodeURIComponent(
          query
        )}&format=json&limit=1`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.length > 0) {
          const { lat, lon, display_name } = data[0];
          setSearchPoint({
            coordinates: [parseFloat(lat), parseFloat(lon)],
            label: display_name,
          });
        }
      } catch (e) {}
    }, 450);

    return () => clearTimeout(timeout);
  }, [query]);


  const requestGeolocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      setCurrentPoint({ coordinates: [lat, lon], label: "Your location" });
    });
  };


  return (
    <div className="font-gilroyRegular bg-vintageBg py-6 px-6 lg:px-24">

      <h2 className="text-center text-3xl font-bold text-vintageText mb-4">
        Store Locator
      </h2>

      {/* -------- SEARCH BAR -------- */}
      <div className="flex items-center w-full h-12 rounded-lg bg-light bg-opacity-50 border border-vintageText px-2 mb-4">
        <button
          className="w-10 h-10 flex items-center justify-center text-gray-600"
          onClick={requestGeolocation}
        >
          <FaLocationArrow />
        </button>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a postcode, area or address..."
          className="flex-1 bg-transparent px-2 text-sm focus:outline-none"
        />

        {query && (
          <button
            className="w-10 h-10 flex items-center justify-center text-gray-500"
            onClick={() => setQuery("")}
          >
            <FaTimes />
          </button>
        )}

        {/* <button className="w-10 h-10 flex items-center justify-center bg-[#326638] text-white rounded-md">
          <FaSearch />
        </button> */}
      </div>

      <div className="flex flex-col md:flex-row gap-6">

        {/* ---------- STORE LIST ---------- */}
 <div className="w-full max-h-[440px] overflow-auto space-y-3 pr-1">
  {filteredStores.map((store) => {
    const selected = selectedId === store.id;

    return (
      <button
        key={store.id}
        onClick={() => setSelectedId(store.id)}
        className={`w-full flex items-start gap-4 p-4 rounded-lg shadow-sm transition-all
          ${
            selected
              ? "border-2 border-[#326638] bg-light bg-opacity-60"
              : "border border-gray-200 bg-light bg-opacity-50 hover:bg-opacity-70"
          }`}
      >
        {/* FIXED ICON COLUMN */}
        <div className="w-10 flex justify-center pt-1">
          <FaMapMarkerAlt className="text-[#326638] text-xl" />
        </div>

        {/* TEXT COLUMN */}
        <div className="flex-1 flex flex-col gap-1 text-left leading-tight">
          <h3 className="font-semibold text-vintageText text-sm md:text-base">
            {store.name}
          </h3>

          <p className="text-gray-700 text-xs md:text-sm">
            {store.address}
          </p>

          <p className="text-vintageText text-opacity-80 text-xs mt-2 font-bold">
            Business Hours
          </p>
          <p className="text-gray-600 text-xs">{store.hours}</p>
        </div>
      </button>
    );
  })}
</div>


        {/* ---------- MAP ---------- */}
        <div className="w-full md:w-[60%] h-[480px] rounded-2xl shadow-md overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={12}
            zoomControl={false}
            className="h-full w-full"
          >
            <ChangeView center={mapCenter} zoom={12} />

            <ZoomControl position="bottomright" />

            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {STORES.map((store) => {
              const visible = filteredStores.some((s) => s.id === store.id);

              return (
                <ControlledMarker
                  key={store.id}
                  store={store}
                  position={store.coordinates}
                  isVisible={visible}
                  isSelected={selectedId === store.id}
                  onMarkerClick={() => setSelectedId(store.id)}
                  icon={createCircleIcon(
                    selectedId === store.id
                      ? "#ef4444"
                      : visible
                      ? "#2563eb"
                      : "#9ca3af"
                  )}
                />
              );
            })}

            {currentPoint.coordinates && (
              <Marker
                position={currentPoint.coordinates}
                icon={createCircleIcon("#16a34a")}
              >
                <Popup>Current location</Popup>
              </Marker>
            )}

            {searchPoint.coordinates && (
              <Marker
                position={searchPoint.coordinates}
                icon={createCircleIcon("#ef4444")}
              >
                <Popup>{searchPoint.label}</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;
