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

// Aset statis dari folder public (logo, ikon, font, dll.) bersifat publik —
// jangan sampai tertahan auth, kalau tidak logo & gambar brand tidak muncul
// dan image optimizer (/_next/image) gagal mengambil sumbernya.
const PUBLIC_FILE =
  /\.(?:jpg|jpeg|png|gif|svg|webp|avif|ico|bmp|woff2?|ttf|otf|eot|txt|xml|json|map|mp4|webm)$/i;

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_FILE.test(pathname)) return true;
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
