import React, { useState } from "react";
import { BannerWithoutBytesDTO } from "Types/Admin/AdminBannerType";

interface BannerTableProps {
  banners: BannerWithoutBytesDTO[];
  onSelectBanner: (id: number | null) => void;
  onDeleteBanner: (id: number) => void;
  onViewBanner: (id: number) => void;
  onEditBanner: (id: number) => void;
  selectedBanner: number | null;
  isLoading?: boolean;
  isError?: boolean;
}

export const BannerTable: React.FC<BannerTableProps> = ({
  banners,
  onSelectBanner,
  onDeleteBanner,
  onViewBanner,
  onEditBanner,
  selectedBanner,
  isLoading = false,
  isError = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedBanners, setSelectedBanners] = useState<number[]>([]);

  const totalPages = Math.ceil(banners.length / itemsPerPage);
  const startItem =
    banners.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, banners.length);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    if (newSelectAll) {
      const currentPageBannerIds = banners
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        .map((banner) => banner.id);
      setSelectedBanners(currentPageBannerIds);

      if (currentPageBannerIds.length > 0) {
        onSelectBanner(currentPageBannerIds[0]);
      }
    } else {
      setSelectedBanners([]);
      onSelectBanner(null);
    }
  };

  const handleSelectBanner = (id: number, checked: boolean) => {
    let newSelectedBanners: number[];

    if (checked) {
      newSelectedBanners = [...selectedBanners, id];
    } else {
      newSelectedBanners = selectedBanners.filter(
        (bannerId) => bannerId !== id
      );
    }

    setSelectedBanners(newSelectedBanners);

    if (newSelectedBanners.length > 0) {
      onSelectBanner(newSelectedBanners[0]);
    } else {
      onSelectBanner(null);
    }

    const currentPageBannerIds = banners
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .map((banner) => banner.id);

    setSelectAll(
      currentPageBannerIds.every((id) => newSelectedBanners.includes(id))
    );
  };

  // Helper function to check if a path is a valid URL
  const isValidUrl = (url: string | null): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Helper function to get displayable image URL
  const getDisplayableImage = (imagePath: string | null): string | null => {
    if (!imagePath) return null;

    // If it's already a valid URL, use it directly
    if (isValidUrl(imagePath)) {
      return imagePath;
    }

    // If it's a local file path, try to extract filename and construct URL
    // This is a fallback - you might need to adjust this logic based on your server setup
    const filename = imagePath.split("\\").pop();
    if (filename) {
      // Construct a URL based on your server's image serving pattern
      return `https://ecommercetesting.objectstore.e2enetworks.net/banner/${filename}`;
    }

    return null;
  };

  return (
    <div className="font-gilroyRegular tracking-wider overflow-x-auto">
      {isLoading ? (
        <div className="py-10 text-center">Loading banners...</div>
      ) : isError ? (
        <div className="py-10 text-center text-red-500">
          Error loading banners
        </div>
      ) : (
        <>
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="py-3 px-4 text-left left-0 bg-white">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 whitespace-nowrap">
                  Title
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 whitespace-nowrap">
                  Description
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 whitespace-nowrap">
                  Button Text
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 whitespace-nowrap">
                  Desktop Image
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 whitespace-nowrap">
                  Mobile Image
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {banners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">
                    No banners found
                  </td>
                </tr>
              ) : (
                banners
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((banner) => {
                    const desktopImage = getDisplayableImage(banner.bannerPath);
                    const mobileImage = getDisplayableImage(
                      banner.bannerPathTwo
                    );

                    return (
                      <tr
                        key={banner.id}
                        className={`border-t ${
                          selectedBanner === banner.id ? "bg-blue-50" : ""
                        }`}
                        onClick={() =>
                          onSelectBanner(
                            selectedBanner === banner.id ? null : banner.id
                          )
                        }
                      >
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={selectedBanners.includes(banner.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectBanner(banner.id, e.target.checked);
                            }}
                          />
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {banner.title || "Untitled Banner"}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {banner.bannerDescription || ""}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {banner.buttonText || "-"}
                        </td>
                        <td className="py-3 px-4">
                          {desktopImage ? (
                            <img
                              src={desktopImage}
                              alt="Desktop Banner"
                              className="h-10 object-contain"
                              width="auto"
                              height="auto"
                            />
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {mobileImage ? (
                            <img
                              src={mobileImage}
                              alt="Mobile Banner"
                              className="h-10 object-contain"
                            />
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                        </td>
                        <td className="py-3 px-4 flex gap-2">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewBanner(banner.id);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-eye-icon lucide-eye"
                            >
                              <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>

                          <button
                            className="text-green-500 hover:text-green-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditBanner(banner.id);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-pencil-icon lucide-pencil"
                            >
                              <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                              <path d="m15 5 4 4" />
                            </svg>
                          </button>

                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteBanner(banner.id);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-trash2-icon lucide-trash-2"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              <line x1="10" x2="10" y1="11" y2="17" />
                              <line x1="14" x2="14" y1="11" y2="17" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4 text-sm">
            <div className="hidden md:flex">
              Showing {startItem} to {endItem} of {banners.length} entries
            </div>
            <div className="flex items-center gap-4">
              <select
                className="p-2 border rounded"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {[10, 25, 50, 100].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 border rounded disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                >
                  &lt;&lt;
                </button>
                <button
                  className="px-2 py-1 border rounded disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  &lt;
                </button>
                <span className="px-2 py-1 bg-gray-100 border rounded">
                  {currentPage}
                </span>
                <button
                  className="px-2 py-1 border rounded disabled:opacity-50"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  &gt;
                </button>
                <button
                  className="px-2 py-1 border rounded disabled:opacity-50"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  &gt;&gt;
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
