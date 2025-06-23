import { NextResponse } from "next/server";

export function middleware(req) {
  const path = req.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/signup" || path === "/";
  const token = req.cookies.get("token")?.value || "";
  console.log("Token in middleware:", token);
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/home", req.nextUrl));
  }
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
}

export const config = {
  matcher: ["/", "/home", "/login", "/signup", "/room/:path*"],
};
