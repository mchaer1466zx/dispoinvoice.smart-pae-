"use server";

import { randomBytes } from "node:crypto";
import { and, count, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { Resend } from "resend";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/password";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
const SESSION_TTL_MS = 60 * 60 * 24 * 30 * 1000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SESSION_COOKIE = "session_token";
const SESSION_COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 30,
};

/** Membuat sesi baru (token acak) untuk user lalu memasang cookie httpOnly. */
async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  await db.insert(sessions).values({ token, userId, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
}

export type UserRole = "admin" | "staff";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

const USER_COLUMNS = {
  id: users.id,
  name: users.name,
  email: users.email,
  role: users.role,
  createdAt: users.createdAt,
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResult =
  | { success: true; user: UserRecord }
  | { success: false; error: string };

/** Server Action untuk mendaftarkan akun baru; menolak jika email sudah terdaftar. */
export async function registerAction(input: RegisterInput): Promise<RegisterResult> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();

  if (!name) {
    return { success: false, error: "Nama wajib diisi." };
  }
  if (!email || !EMAIL_PATTERN.test(email)) {
    return { success: false, error: "Format email tidak valid." };
  }
  if (!input.password || input.password.length < 6) {
    return { success: false, error: "Kata sandi minimal 6 karakter." };
  }

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    return { success: false, error: "Email sudah terdaftar." };
  }

  try {
    const passwordHash = await hashPassword(input.password);

    // Pengguna pertama di sistem otomatis menjadi admin; selebihnya staff.
    const [row] = await db.select({ total: count() }).from(users);
    const role: UserRole = (row?.total ?? 0) === 0 ? "admin" : "staff";

    const [created] = await db
      .insert(users)
      .values({ name, email, passwordHash, role })
      .returning(USER_COLUMNS);

    return { success: true, user: created };
  } catch {
    return { success: false, error: "Email sudah terdaftar." };
  }
}

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResult =
  | { success: true; user: UserRecord }
  | { success: false; error: string };

/** Server Action untuk login; memverifikasi kredensial lalu membuat sesi (cookie httpOnly). */
export async function loginAction(input: LoginInput): Promise<LoginResult> {
  const email = input.email.trim().toLowerCase();

  if (!email || !input.password) {
    return { success: false, error: "Email dan kata sandi wajib diisi." };
  }

  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      passwordHash: users.passwordHash,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    return { success: false, error: "Email atau kata sandi salah." };
  }

  await createSession(user.id);

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
}

/**
 * Server Action untuk mengambil pengguna dari sesi aktif saat ini (null jika belum
 * login). Sesi diverifikasi lewat token cookie yang dipetakan ke tabel sessions,
 * dan hanya sesi yang belum kedaluwarsa yang diterima.
 */
export async function getSessionUserAction(): Promise<UserRecord | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [row] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.token, token),
        gt(sessions.expiresAt, new Date().toISOString())
      )
    )
    .limit(1);

  return row ?? null;
}

/** Server Action untuk logout; menghapus baris sesi di database dan cookie-nya. */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.token, token));
  }
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Lapisan pertahanan kedua di dalam Server Action itu sendiri (selain middleware),
 * karena Server Action bisa dipanggil lewat POST ke route mana pun. Lempar error jika
 * belum login; dipakai di awal action yang mengubah atau menampilkan data privat.
 */
export async function requireSessionUser(): Promise<UserRecord> {
  const user = await getSessionUserAction();
  if (!user) {
    throw new Error("Belum login.");
  }
  return user;
}

/**
 * Server Action ringan untuk memeriksa apakah sesi saat ini milik admin.
 * Dipakai komponen server (mis. halaman /pengaturan) untuk memutuskan render
 * konten admin atau halaman 403 Forbidden tanpa melempar error.
 */
export async function isAdminAction(): Promise<boolean> {
  const user = await getSessionUserAction();
  return user?.role === "admin";
}

/**
 * Pertahanan tingkat Server Action untuk operasi khusus admin (mis. kelola
 * perusahaan). Melempar error bila belum login atau bukan admin, sehingga
 * action tetap aman walau dipanggil langsung lewat POST.
 */
export async function requireAdmin(): Promise<UserRecord> {
  const user = await requireSessionUser();
  if (user.role !== "admin") {
    throw new Error("Akses ditolak: khusus admin.");
  }
  return user;
}

export type RequestPasswordResetResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Server Action untuk memulai alur reset password: membuat token sekali pakai (berlaku 1 jam)
 * dan mengirim instruksi ke email pengguna. Selalu balas sukses walau email tidak terdaftar,
 * supaya tidak membocorkan email mana yang punya akun.
 */
export async function requestPasswordResetAction(
  email: string
): Promise<RequestPasswordResetResult> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !EMAIL_PATTERN.test(normalizedEmail)) {
    return { success: false, error: "Format email tidak valid." };
  }

  const [user] = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (!user) {
    return { success: true };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      error: "Layanan email belum dikonfigurasi (RESEND_API_KEY belum diatur).",
    };
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString();

  await db
    .update(users)
    .set({ resetToken: token, resetTokenExpiresAt: expiresAt })
    .where(eq(users.id, user.id));

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.INVOICE_EMAIL_FROM ?? "PT Karya Sang Prabu <no-reply@karyasangprabu.co.id>",
    to: normalizedEmail,
    subject: "Atur ulang kata sandi Sistem Pengadaan PT KSP",
    text: `Halo ${user.name}, klik tautan berikut untuk mengatur ulang kata sandi Anda (berlaku 1 jam): ${resetUrl}`,
  });

  if (error) {
    return { success: false, error: "Gagal mengirim email instruksi." };
  }

  return { success: true };
}

export type ResetPasswordResult =
  | { success: true }
  | { success: false; error: string };

/** Server Action untuk menyelesaikan reset password memakai token dari email. */
export async function resetPasswordAction(
  token: string,
  newPassword: string
): Promise<ResetPasswordResult> {
  if (!token) {
    return { success: false, error: "Token tidak valid." };
  }
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: "Kata sandi minimal 6 karakter." };
  }

  const [user] = await db
    .select({
      id: users.id,
      resetToken: users.resetToken,
      resetTokenExpiresAt: users.resetTokenExpiresAt,
    })
    .from(users)
    .where(eq(users.resetToken, token))
    .limit(1);

  if (!user || !user.resetTokenExpiresAt || new Date(user.resetTokenExpiresAt) < new Date()) {
    return { success: false, error: "Token tidak valid atau sudah kedaluwarsa." };
  }

  const passwordHash = await hashPassword(newPassword);

  await db
    .update(users)
    .set({ passwordHash, resetToken: null, resetTokenExpiresAt: null })
    .where(eq(users.id, user.id));

  // Cabut semua sesi lama pengguna ini setelah kata sandi diganti.
  await db.delete(sessions).where(eq(sessions.userId, user.id));

  return { success: true };
}

export type UpdateProfileInput = {
  name: string;
  email: string;
};

export type UpdateProfileResult =
  | { success: true; user: UserRecord }
  | { success: false; error: string };

/** Server Action untuk mengubah nama/email pengguna yang sedang login (dari sesi). */
export async function updateProfileAction(
  input: UpdateProfileInput
): Promise<UpdateProfileResult> {
  const sessionUser = await getSessionUserAction();
  if (!sessionUser) {
    return { success: false, error: "Anda belum masuk." };
  }
  const userId = sessionUser.id;

  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();

  if (!name) {
    return { success: false, error: "Nama wajib diisi." };
  }
  if (!email || !EMAIL_PATTERN.test(email)) {
    return { success: false, error: "Format email tidak valid." };
  }

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing && existing.id !== userId) {
    return { success: false, error: "Email sudah dipakai akun lain." };
  }

  try {
    const [updated] = await db
      .update(users)
      .set({ name, email })
      .where(eq(users.id, userId))
      .returning(USER_COLUMNS);

    if (!updated) {
      return { success: false, error: "Pengguna tidak ditemukan." };
    }

    return { success: true, user: updated };
  } catch {
    return { success: false, error: "Email sudah dipakai akun lain." };
  }
}
