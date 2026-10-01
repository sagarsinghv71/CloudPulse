import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || "cloudpulse-dev-secret-key-32-chars-long-minimum!"
);

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/services",
  "/deployments",
  "/incidents",
  "/logs",
  "/metrics",
  "/ai-copilot",
  "/team",
  "/settings",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = req.cookies.get("cp_session")?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, SECRET_KEY);
    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete("cp_session");
    return res;
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/services/:path*",
    "/deployments/:path*",
    "/incidents/:path*",
    "/logs/:path*",
    "/metrics/:path*",
    "/ai-copilot/:path*",
    "/team/:path*",
    "/settings/:path*",
  ],
};
