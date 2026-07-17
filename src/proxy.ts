import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "session_user_id";

const PUBLIC_PATHS = ["/login", "/daftar", "/reset-password"];

const PUBLIC_PREFIXES = [
  "/verify/",
  "/po/publik/",
  "/api/invoices/",
  "/api/purchase-orders/",
  "/api/memos/",
  "/api/documents/",
];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Menahan akses ke halaman & API privat sebelum sampai ke Server Action/route
 * handler jika belum login. Tautan berbagi (PDF/verifikasi) tetap publik karena
 * memakai token UUID yang tidak tertebak.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  if (hasSession) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Belum login." }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
