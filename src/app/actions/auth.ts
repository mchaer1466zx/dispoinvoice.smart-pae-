"use server";

import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { Resend } from "resend";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/password";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SESSION_COOKIE = "session_user_id";
const SESSION_COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 30,
};

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

const USER_COLUMNS = {
  id: users.id,
  name: users.name,
  email: users.email,
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

    const [created] = await db
      .insert(users)
      .values({ name, email, passwordHash })
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
      passwordHash: users.passwordHash,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    return { success: false, error: "Email atau kata sandi salah." };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, user.id, SESSION_COOKIE_OPTIONS);

  return {
    success: true,
    user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
  };
}

/** Server Action untuk mengambil pengguna dari sesi aktif saat ini (null jika belum login). */
export async function getSessionUserAction(): Promise<UserRecord | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!userId) return null;

  const [user] = await db
    .select(USER_COLUMNS)
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user ?? null;
}

/** Server Action untuk logout; menghapus cookie sesi. */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
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
    from: process.env.INVOICE_EMAIL_FROM ?? "DispoInvoice <invoice@dispoinvoice.app>",
    to: normalizedEmail,
    subject: "Atur ulang kata sandi DispoInvoice",
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
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!userId) {
    return { success: false, error: "Anda belum masuk." };
  }

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
