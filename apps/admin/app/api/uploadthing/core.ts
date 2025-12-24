// apps/admin/app/api/uploadthing/core.ts

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@acme/auth";
import { pool } from "@acme/db";

const f = createUploadthing();

export const mediaRouter = {
  productImage: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 5,
    },
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) throw new Error("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      const result = await pool.query(
        `INSERT INTO media
          (file_name, file_url, file_type, size, uploaded_by)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING media_id`,
        [file.name, file.url, file.type, file.size, metadata.userId]
      );

      return { mediaId: result.rows[0].media_id };
    }),
} satisfies FileRouter;

export type MediaRouter = typeof mediaRouter;
