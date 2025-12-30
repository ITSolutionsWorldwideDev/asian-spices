// apps/admin/components/media/FeaturedImageUpload.tsx
"use client";

import { UploadButton } from "@uploadthing/react";
import type { MediaRouter } from "@/app/api/uploadthing/core";
import { useToast } from "@repo/ui";

export default function FeaturedImageUpload({
  onUpload,
}: {
  onUpload: (mediaId: number, url: string) => void;
}) {
  const { showToast } = useToast();
  return (
    <UploadButton<MediaRouter, "productImage">
      endpoint="productImage"
      className="rounded border border-dashed border-gray-400 px-6 py-3 hover:border-primary "
      onClientUploadComplete={(res) => {
        const file = res?.[0];
        if (file) {
          onUpload(file.serverData.mediaId, file.url);
          showToast("success", "Upload complete");
        }
      }}
      onUploadError={(err) => {
        showToast("error", err.message);
      }}
    />
  );
}
