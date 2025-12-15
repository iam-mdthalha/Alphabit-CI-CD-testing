"use client";

import { notifications } from "@mantine/notifications";
import { BannerActions } from "Components/Admin/AdminBanner/BannerActions";
import { BannerForm } from "Components/Admin/AdminBanner/BannerForm";
import { BannerTable } from "Components/Admin/AdminBanner/BannerTable";
import { Header } from "Components/Admin/StyleComponent/Header";
import { useMemo, useState } from "react";
import {
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useGetAllBannersWithoutBytesQuery,
  useUpdateBannerMutation,
  useUploadBanner2ImageMutation,
  useUploadBannerImageMutation,
} from "Services/Admin/BannerApiSlice";
import {
  BannerAdminRequestDTO,
  BannerWithoutBytesDTO,
} from "Types/Admin/AdminBannerType";

const PLANT = process.env.REACT_APP_PLANT;

const AdminBanner = () => {
  const {
    data: apiBanners,
    isLoading,
    refetch,
  } = useGetAllBannersWithoutBytesQuery();
  const banners: BannerWithoutBytesDTO[] = apiBanners?.results || [];

  const [createBanner] = useCreateBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();
  const [uploadBannerImage] = useUploadBannerImageMutation();
  const [uploadBanner2Image] = useUploadBanner2ImageMutation();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingBanner, setEditingBanner] =
    useState<BannerWithoutBytesDTO | null>(null);
  const [selectedBannerId, setSelectedBannerId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");

  const filteredBanners = useMemo(() => {
    if (!banners) return [];
    return searchText
      ? banners.filter(
          (banner) =>
            (banner.title || "")
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            (banner.bannerDescription || "")
              .toLowerCase()
              .includes(searchText.toLowerCase())
        )
      : [...banners];
  }, [banners, searchText]);

  // Create a new mapping function for BannerWithoutBytesDTO
  const bannerMappingFromWithoutBytesToRequest = (
    banner: BannerWithoutBytesDTO | null
  ) => {
    if (banner != null) {
      return {
        buttonText: banner.buttonText || "",
        content: banner.content || "",
        description: banner.bannerDescription || "",
        link: banner.link || "",
        lnNo: banner.bannerLnNo,
        title: banner.title || "",
      } as BannerAdminRequestDTO;
    } else {
      return null;
    }
  };

  const handleViewBanner = async (id: number) => {
    try {
      const bannerToView = banners.find((banner) => banner.id === id);
      if (bannerToView) {
        setEditingBanner(bannerToView);
        setViewMode(true);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get banner details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load banner details",
        color: "red",
      });
    }
  };

  const handleEditBanner = async (id: number) => {
    try {
      const bannerToEdit = banners.find((banner) => banner.id === id);
      if (bannerToEdit) {
        setEditingBanner(bannerToEdit);
        setViewMode(false);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get banner details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load banner details",
        color: "red",
      });
    }
  };

  const handleSubmit = async (
    data: BannerAdminRequestDTO,
    imageFile?: File,
    mobileImageFile?: File
  ) => {
    try {
      if (editingBanner) {
        const updatedData = {
          bannerDescription: data.description,
          bannerLnNo: data.lnNo,
          title: data.title,
          content: data.content,
          buttonText: data.buttonText,
          link: data.link,
          plant: PLANT!,
        };

        await updateBanner({
          id: editingBanner.id,
          data: updatedData,
        }).unwrap();

        if (imageFile) {
          try {
            await uploadBannerImage({
              id: editingBanner.id,
              file: imageFile,
            }).unwrap();
            notifications.show({
              title: "Success!",
              message: "Banner updated successfully",
              color: "teal",
            });
          } catch (uploadError) {
            notifications.show({
              title: "Warning!",
              message: "Banner updated but image upload failed",
              color: "yellow",
            });
          }
        } else {
          notifications.show({
            title: "Success!",
            message: "Banner updated successfully",
            color: "teal",
          });
        }

        if (mobileImageFile) {
          try {
            const res2 = await uploadBanner2Image({
              id: editingBanner.id,
              file: mobileImageFile,
            }).unwrap();
          } catch (uploadError) {
            console.error("Image2 upload failed:", uploadError);
          }
        }
      } else {
        const createData = {
          ...data,
          plant: PLANT!,
        };

        const resultDTO = await createBanner(createData).unwrap();
        const newBannerId = resultDTO.results as number;

        if (imageFile) {
          try {
            await uploadBannerImage({
              id: newBannerId,
              file: imageFile,
            }).unwrap();
            notifications.show({
              title: "Success!",
              message: "Banner created successfully",
              color: "teal",
            });
          } catch (uploadError) {
            notifications.show({
              title: "Warning!",
              message: "Banner created but image upload failed",
              color: "yellow",
            });
          }
        } else {
          notifications.show({
            title: "Success!",
            message: "Banner created successfully",
            color: "teal",
          });
        }

        if (mobileImageFile) {
          try {
            const res2 = await uploadBanner2Image({
              id: newBannerId,
              file: mobileImageFile,
            }).unwrap();
          } catch (uploadError) {
            console.error("Image2 upload failed:", uploadError);
          }
        }
      }

      await refetch();
      setShowForm(false);
      setEditingBanner(null);
    } catch (error) {
      console.error("Failed to save banner:", error);
    }
  };

  const handleDeleteBanner = async (id: number) => {
    try {
      await deleteBanner(id).unwrap();
      await refetch();
      notifications.show({
        title: "Success!",
        message: "Banner deleted successfully",
        color: "teal",
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Failed to delete banner",
        color: "red",
      });
      console.error("Failed to delete banner:", error);
    }
  };

  return (
    <div className="font-gilroyRegular p-6 max-w-7xl mx-auto">
      {!showForm ? (
        <>
          <Header
            title="Banners"
            onAdd={() => setShowForm(true)}
            addLabel="Add Banner"
          />
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-4 pt-8">
            <BannerActions
              onSearchChange={setSearchText}
              isDeleteDisabled={!selectedBannerId}
              onDelete={() =>
                selectedBannerId && handleDeleteBanner(selectedBannerId)
              }
            />
            <BannerTable
              banners={filteredBanners}
              onSelectBanner={setSelectedBannerId}
              onDeleteBanner={handleDeleteBanner}
              onViewBanner={handleViewBanner}
              onEditBanner={handleEditBanner}
              selectedBanner={selectedBannerId}
              isLoading={isLoading}
            />
          </div>
        </>
      ) : (
        <>
          <button
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-4"
            onClick={() => {
              setShowForm(false);
              setEditingBanner(null);
              setViewMode(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-left-icon lucide-arrow-left h-4 w-4"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            <span className="text-sm">Back</span>
          </button>
          <Header
            title={
              viewMode
                ? "View Banner"
                : editingBanner
                ? "Edit Banner"
                : "Add Banner"
            }
          />
          <BannerForm
            initialValues={
              bannerMappingFromWithoutBytesToRequest(editingBanner) || {
                title: "",
                description: "",
                content: "",
                buttonText: "",
                link: "",
                lnNo: 0,
              }
            }
            existingImage={editingBanner?.bannerPath || undefined}
            existingMobileImage={editingBanner?.bannerPathTwo || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setViewMode(false);
              setEditingBanner(null);
            }}
            mode={viewMode ? "view" : editingBanner ? "edit" : "add"}
          />
        </>
      )}
    </div>
  );
};

export default AdminBanner;
