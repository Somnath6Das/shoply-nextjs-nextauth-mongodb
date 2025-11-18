import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 🧠 If visiting /admin and already logged in as admin → redirect to /admin/dashboard
  if (pathname === "/admin" && token?.role === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // 🚫 If visiting any /admin path but not logged in or not admin → redirect to /login
  if (pathname.startsWith("/admin/dashboard") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // seller
  if (pathname === "/seller" && token?.role === "seller") {
    return NextResponse.redirect(new URL("/seller/dashboard", request.url));
  }

  if (pathname.startsWith("/seller/dashboard") && token?.role !== "seller") {
    return NextResponse.redirect(new URL("/seller", request.url));
  }

  // ✅ Otherwise, allow normal request
  return NextResponse.next();
}

// Apply proxy to all /admin routes
export const config = {
  matcher: ["/admin/:path*", "/seller/:path*"],
};
