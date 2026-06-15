// apps/web/middleware.ts

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

/* import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "site-access";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // // Skip site lock for Vercel preview/domain
  // if (hostname === "asian-spices-web.vercel.app") {
  //   return NextResponse.next();
  // }

  const hostname = req.nextUrl.hostname;

  const shouldApplySiteLock =
    hostname === "www.asianspices.online" || hostname === "asianspices.online";

  if (!shouldApplySiteLock) {
    return NextResponse.next();
  }

  // Disable protection completely if needed
  const siteLockEnabled = process.env.SITE_LOCK_ENABLED === "true";

  if (!siteLockEnabled) {
    return NextResponse.next();
  }

  // Allow static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  // Allow specific public routes
  const publicRoutes = ["/coming-soon", "/site-access", "/api/site-access"];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Allow important APIs/webhooks
  if (
    pathname.startsWith("/api/paypal") ||
    pathname.startsWith("/api/paynl") ||
    pathname.startsWith("/api/webhook") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // Check access cookie
  const cookie = req.cookies.get(COOKIE_NAME);

  if (cookie?.value === process.env.SITE_ACCESS_PASSWORD) {
    return NextResponse.next();
  }

  // Redirect visitors to Coming Soon page
  return NextResponse.redirect(new URL("/coming-soon", req.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
 */