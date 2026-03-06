// apps/admin/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";

const PLATFORM_SUBDOMAIN = "admin";

function extractSubdomain(hostname: string) {
  const host = hostname.split(":")[0];
  const parts = host.split(".");

  const rootDomains = ["localhost", "vercel.app", "yourproductiondomain.com"];
  if (parts.length <= 2 && rootDomains.some(d => host.endsWith(d))) {
    return ""; 
  }

  return parts[0];
}

export default withAuth(
  function middleware(req: NextRequest) {
    const hostname = req.headers.get("host") || "";
    
    const subdomain = extractSubdomain(hostname);
    const pathname = req.nextUrl.pathname;

    // 1. FIX: Development Subdomain Force
    if (process.env.NODE_ENV === "development") {
      if (!hostname.includes("admin.localhost") && !hostname.includes(".localhost")) {
        
        const url = req.nextUrl.clone();
        url.hostname = "admin.localhost";
        return NextResponse.redirect(url);
      }
    }

    
    const isPlatformRoute = pathname.startsWith("/platform");

    if (pathname.startsWith("/api")) {
      const res = NextResponse.next();
      res.headers.set("x-tenant-subdomain", subdomain);
      return res;
    }

    // 🚫 Store accessing platform
    if (subdomain !== PLATFORM_SUBDOMAIN && isPlatformRoute) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // 🚫 Platform accessing store
    if (subdomain === PLATFORM_SUBDOMAIN && !isPlatformRoute) {
      return NextResponse.redirect(new URL("/platform/dashboard", req.url));
    } 

    const res = NextResponse.next();
    res.headers.set("x-tenant-subdomain", subdomain);

    return res;
  },
  {
    callbacks: {
      async authorized({ token, req }) {
        const hostname = req.headers.get("host") || "";
        const subdomain = extractSubdomain(hostname);
        const isPlatformSubdomain = subdomain === "admin";

        if (!token) return false;

        
        if (isPlatformSubdomain) {
          return !!token.isPlatformAdmin;
        }
        return !!(token.isPlatformAdmin || (token.storeRoles && token.storeRoles.length > 0));
      },
    },
    pages: {
      signIn: "/login",
    },
  },
);
export const config = {
  matcher: ["/((?!_next|static|_next/image|assets|favicon.ico|favicon.png|robots.txt|.*\\.svg$|login).*)", "/api/:path*"],
};



    // ✅ DEV: Redirect localhost → admin.localhost
    // if (process.env.NODE_ENV === "development") {
    //   if (
    //     hostname.startsWith("localhost") ||
    //     hostname.startsWith("127.0.0.1")
    //   ) {
    //     const url = req.nextUrl.clone();
    //     url.hostname = "admin.localhost";
    //     return NextResponse.redirect(url);
    //   }
    // }
    
        // if (subdomain === PLATFORM_SUBDOMAIN) {
        //   return !!token.isPlatformAdmin;
        // }

        // For other subdomains (storefronts/tenant dashboards), 
        // allow if they have any store roles or are a platform admin
        // return !!(token.isPlatformAdmin || token.storeRoles?.length);

// export const config = {
//   matcher: ["/((?!api|_next|static|assets|favicon.ico|login).*)"],
// };


/* export default withAuth({
  callbacks: {
    async authorized({ token }) {
      if (!token) return false;

      // Platform admins have full access
      if (token.isPlatformAdmin) return true;

      // Store admins/managers/editors: check storeRoles
      return !!token.storeRoles?.length;
    }
  }
});

// Subdomain resolution
export function middleware(req: NextRequest) {
  const hostname = req.headers.get("host") || ""; // e.g. store1.admin.localhost:3000
  const subdomain = hostname.split(".")[0];       // store1

  // Save store subdomain in request header for layouts
  const res = NextResponse.next();
  res.headers.set("x-tenant-subdomain", subdomain);

  return res;
} */

/* import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    const { nextUrl } = req;
    const host = req.headers.get("host") || "";

    let subdomain: string | null = null;

    const hostname = host.split(":")[0]; // remove port

    if (hostname.endsWith(".localhost")) {
      // store1.localhost
      subdomain = hostname.split(".")[0];
    } else {
      const parts = hostname.split(".");
      // store1.admin.yourapp.com
      if (parts.length >= 3) {
        subdomain = parts[0];
      }
    }

    // Platform domain (admin.yourapp.com or localhost)
    if (
      hostname === "localhost" ||
      hostname.startsWith("admin.") ||
      subdomain === "admin"
    ) {
      return NextResponse.next();
    }

    // Attach tenant header for store layouts
    if (subdomain) {
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-tenant-subdomain", subdomain);

      return NextResponse.next({
        request: {
          headers: requestHeaders
        }
      });
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        // Only check authentication here
        return !!token;
      }
    }
  }
); */

/* 
import { withAuth } from "next-auth/middleware";
import type { JWT } from "next-auth/jwt";
import { AUTH_ROLES } from "@acme/auth/constants";
import type { StoreRole } from "@acme/auth";

type AdminJWT = JWT & {
  isPlatformAdmin?: boolean;
  storeRoles?: StoreRole[];
};

export default withAuth({
  callbacks: {
    authorized({ token }: { token: AdminJWT | null }) {
      
      if (!token) return false;

      // ✅ Platform admin: full access
      if (token.isPlatformAdmin === true) {
        return true;
      }
      
      return (
        token.storeRoles?.some(r =>
          r.role === AUTH_ROLES.ADMIN ||
          r.role === AUTH_ROLES.MANAGER ||
          r.role === AUTH_ROLES.EDITOR
        ) ?? false
      );
    }
  }
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!api|login|_next|static|assets|favicon.ico).*)"
  ]
};
 */
