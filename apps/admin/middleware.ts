// apps/admin/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bypass middleware for static assets, internal Next.js paths, and the maintenance page itself
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname === "/maintenance" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. Rewrite everything else to the maintenance page
  // A rewrite serves the maintenance page content while keeping the user's current URL intact
  return NextResponse.rewrite(new URL("/maintenance", request.url));
}

// 3. Stop the middleware from executing on obvious asset files
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|vercel.svg).*)',
  ],
};


/* import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

// apps/admin/middleware.ts
export default withAuth(
  async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;

    if (
      pathname.startsWith("/_next") ||
      // pathname.startsWith("/api") ||
      pathname.includes(".") // e.g. favicon.ico, logo.png
    ) {
      return NextResponse.next();
    }

    // 2. Define the "protected" prefixes
    const isStorePath = pathname.startsWith("/store");
    const isPlatformPath = pathname.startsWith("/platform");
    const isAuthPath = pathname.startsWith("/login");
    const isApi = pathname.startsWith("/api");

    if (isApi) {
      const referer = req.headers.get("referer");
      const requestHeaders = new Headers(req.headers);
      
      // If the API is called from a store page, grab the slug from referer
      if (referer && referer.includes("/store/")) {
        const url = new URL(referer);
        const slug = url.pathname.split("/")[2];
        requestHeaders.set("x-tenant-subdomain", slug);
      }

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    }

    // 3. Handle Root and Unprefixed Paths
    if (!isStorePath && !isPlatformPath && !isAuthPath && pathname !== "/login") {
      // CASE: Super Admin
      if (token?.isPlatformAdmin) {
        const destination = pathname === "/" ? "/dashboard" : pathname;
        return NextResponse.redirect(
          new URL(`/platform${destination}`, req.url),
        );
      }

      // CASE: Store User
      const storeRoles = token?.storeRoles as any[];

      if (storeRoles && storeRoles.length > 0) {
        
        const firstStore = storeRoles[0]?.slug || storeRoles[0].store_id;
        const destination = pathname === "/" ? "/dashboard" : pathname;

        return NextResponse.redirect(
          new URL(`/store/${firstStore}${destination}`, req.url),
        );
      }
    }

    if (isStorePath) {
      const slug = pathname.split("/")[2];
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-tenant-subdomain", slug);
      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    }

    // 4. Security Check: Prevent Store Users from accessing /platform
    if (isPlatformPath && !token?.isPlatformAdmin) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  },
);

export const config = {
  matcher: [
    "/((?!_next|static|_next/image|assets|favicon.ico|favicon.png|robots.txt|.*\\.svg$|login).*)",
    "/platform/:path*",
    "/store/:path*",
    "/api/:path*",
  ],
}; */
