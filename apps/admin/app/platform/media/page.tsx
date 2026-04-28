// apps/admin/app/(admin)/media/page.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useToast } from "@repo/ui";

import { UploadButton, UploadDropzone } from "@uploadthing/react";
import type { MediaRouter } from "@/app/api/uploadthing/core";

interface MediaItem {
  media_id: number;
  file_name: string;
  file_url: string;
  file_type: string;
  created_at: string;
}

export default function MediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const { showToast } = useToast();

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/media");
      const data = await res.json();
      setMedia(data);
    } catch {
      showToast("error", "Failed to load Media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleDelete = async (ids: number[] | number) => {
    const list = Array.isArray(ids) ? ids : [ids];

    if (!confirm(`Delete ${list.length} file(s)?`)) return;

    await Promise.all(
      list.map((id) => fetch(`/api/media?id=${id}`, { method: "DELETE" })),
    );

    setSelected([]);
    fetchMedia();
    showToast("success", "Deleted successfully");
  };

  const formatFileName = (name: string) => {
    let cleaned = name.split("-").slice(1).join("-");
    cleaned = cleaned.replace(/_/g, " ");
    return cleaned.length > 40 ? cleaned.slice(0, 40) + "..." : cleaned;
  };

  return (
    <div className="page-wrapper">
      <div className="content max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h4 className="text-xl font-semibold">Media Library</h4>
          <p className="text-gray-500">Upload and manage your assets</p>
        </div>

        {/* DROPZONE (NEW UX) */}
        <div className="mb-6 rounded-lg border bg-gray-50 p-4">
          <UploadDropzone<MediaRouter, "productImage">
            endpoint="productImage"
            className="rounded border border-dashed border-gray-400 px-6 py-3 hover:border-primary bg-orange-500 hover:bg-orange-600 text-white "
            onClientUploadComplete={async (res) => {
              console.log("productImage res === ", res);
              if (!res?.length) return;

              try {
                await Promise.all(
                  res.map((file) =>
                    fetch("/api/media/save", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        file_name: file.name,
                        file_url: file.ufsUrl,
                        file_type: file.type,
                        size: file.size,
                      }),
                    }),
                  ),
                );

                showToast("success", "Files uploaded successfully");
                fetchMedia();
              } catch (err: any) {
                showToast("error", err.message);
              }
            }}
            onUploadError={(err) => {
              showToast("error", err.message);
            }}
          />
        </div>

        {/* Bulk actions */}
        {selected.length > 0 && (
          <div className="mb-4 flex gap-3">
            <button
              onClick={() => handleDelete(selected)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete Selected ({selected.length})
            </button>

            <button
              onClick={() => setSelected([])}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Clear
            </button>
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {media.map((item) => {
            const displayName = formatFileName(item.file_name);
            const isSelected = selected.includes(item.media_id);

            return (
              <div
                key={item.media_id}
                onClick={() => toggleSelect(item.media_id)}
                className={`relative cursor-pointer rounded border p-2 transition
                  ${isSelected ? "ring-2 ring-blue-500" : "hover:shadow-md"}
                `}
              >
                {/* IMAGE */}
                {item.file_type.startsWith("image/") ? (
                  <Image
                    src={item.file_url}
                    alt={item.file_name}
                    width={200}
                    height={200}
                    className="h-32 w-full object-cover rounded"
                  />
                ) : (
                  <div className="h-32 flex items-center justify-center text-xs bg-gray-100">
                    {displayName}
                  </div>
                )}

                {/* filename */}
                <p className="mt-1 text-xs text-gray-600 truncate">
                  {displayName}
                </p>

                {/* delete single */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.media_id);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        {/* loading */}
        {loading && (
          <p className="text-center mt-4 text-gray-500">Loading media...</p>
        )}
      </div>
    </div>
  );
}
/* "use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useToast } from "@repo/ui";

import { UploadButton, UploadDropzone } from "@uploadthing/react";
import type { MediaRouter } from "@/app/api/uploadthing/core";

interface MediaItem {
  media_id: number;
  file_name: string;
  file_url: string;
  file_type: string;
  created_at: string;
}

export function getThumb(url: string, size = 300) {
  return `${url}?w=${size}&h=${size}&fit=crop`;
}

export default function MediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setMedia(data);
    } catch {
      showToast("error", "Failed to load Media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this image?")) return;

    await fetch(`/api/media?id=${id}`, {
      method: "DELETE",
    });
    await fetchMedia();
  };

  const formatFileName = (name: string) => {
    // remove prefix before first hyphen
    let cleaned = name.split("-").slice(1).join("-");

    // remove underscores
    cleaned = cleaned.replace(/_/g, " ");

    // limit to 50 chars
    if (cleaned.length > 50) {
      cleaned = cleaned.slice(0, 50) + "...";
    }

    return cleaned;
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header flex flex-rows md:flex-col justify-between items-center mb-4">
            <div className=" w-full">
              <h4 className="text-lg font-semibold">Media Library</h4>
              <h6 className="text-gray-500">Manage your media</h6>
            </div>
            <div className="p-6 card table-list-card  w-full">
              <div className="card-body bg-gray-100">

                <div className="mb-4">
                  <UploadButton<MediaRouter, "productImage">
                    endpoint="productImage"
                    className="rounded border border-dashed border-gray-400 px-6 py-3 hover:border-primary "
                    onClientUploadComplete={async (res) => {
                      console.log("CLIENT UPLOAD DONE", res);
                      const file = res?.[0];

                      // ✅ Safety checks
                      if (!file || !file.ufsUrl) {
                        showToast(
                          "error",
                          "Upload failed: invalid file response",
                        );
                        return;
                      }

                      try {
                        const response = await fetch("/api/media/save", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            file_name: file.name,
                            file_url: file.ufsUrl, // ✅ correct
                            file_type: file.type,
                            size: file.size,
                          }),
                        });

                        const data = await response.json();

                        if (!response.ok) {
                          throw new Error(
                            data?.error || "Failed to save media",
                          );
                        }

                        console.log("DB SAVED ✅", data);

                        // ✅ SINGLE success message
                        showToast("success", "Upload + Save successful ✅");

                        // ✅ SINGLE refresh
                        fetchMedia();
                      } catch (err: any) {
                        console.error("SAVE ERROR ❌", err);
                        showToast(
                          "error",
                          err.message || "Something went wrong",
                        );
                      }
                    }}
                    onUploadError={(err: any) => {
                      showToast("error", err.message);
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols- p-4">
                  {media.map((item) => {
                    const displayName = formatFileName(item.file_name);

                    return (
                      <div
                        key={item.media_id}
                        className="relative rounded border bg-gray-50 p-2 hover:shadow-md"
                      >
                        {item.file_type.startsWith("image/") ? (
                          <Image
                            // src={getThumb(item.file_url, 200)}
                            src={item.file_url}
                            alt={item.file_name}
                            width={200}
                            height={200}
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex aspect-square items-center justify-center wrap-break-word bg-gray-200 p-2 text-center text-xs text-gray-700">
                            {item.file_type} <br />
                            {displayName}
                          </div>
                        )}

                        <button
                          onClick={() => handleDelete(item.media_id)}
                          className="absolute right-1 top-1 rounded bg-red-500 px-2 py-1 text-xs text-white"
                        >
                          Delete
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} */

/* const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        showToast("error", "Max file size is 5MB");
        return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("module_ref", "blogs");

    const res = await fetch("/api/media", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
        await fetchMedia();
    } else {
        showToast("error", "Upload failed");
    }

    setUploading(false);
  }; */
{
  /* <Image
                  src={item.file_path}
                  alt={item.file_name}
                  width={200}
                  height={200}
                  className="aspect-square w-full rounded object-cover"
                /> */
}
