// apps/admin/app/api/uploadthing/route.ts
import { createRouteHandler } from "uploadthing/next";
import { mediaRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: mediaRouter,
});
