// apps/admin/app/(admin)/media/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useToast } from "@repo/ui";

import { UploadButton } from "@uploadthing/react";
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
                {/* <h1 className="mb-6 text-2xl font-bold">Media Library</h1> */}

                <div className="mb-4">
                  <UploadButton<MediaRouter, "productImage">
                    endpoint="productImage"
                    className="rounded border border-dashed border-gray-400 px-6 py-3 hover:border-primary "
                    onClientUploadComplete={() => {
                      showToast("success", "Upload complete");
                      fetchMedia();
                    }}
                    onUploadError={(err) => {
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
                            src={getThumb(item.file_url, 200)}
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
}

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
