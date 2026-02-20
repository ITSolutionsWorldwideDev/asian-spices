// apps/admin/middleware.ts
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




// import { AUTH_ROLES, type StoreRole } from "@acme/auth";
      // ✅ Store-level admin roles
      // const hasAdminRole = token.storeRoles?.some(r =>
      //   r.role === AUTH_ROLES.ADMIN ||
      //   r.role === AUTH_ROLES.MANAGER ||
      //   r.role === AUTH_ROLES.EDITOR
      // );

/* 
// apps/admin/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // Allow platform routes without tenant resolution
    if (pathname.includes("/(platform)")) {
      return NextResponse.next();
    }

    // Resolve storeId for store routes
    const match = pathname.match(/\/\(store\)\/([^/]+)/);

    if (match) {
      const storeId = match[1];
      const res = NextResponse.next();
      res.headers.set("x-store-id", storeId);
      return res;
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        return !!token;
      }
    }
  }
);

export const config = {
  matcher: ["/admin/:path*"]
};

*/