"use server";

import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { getSessionUserAction, requireSessionUser } from "@/app/actions/auth";

export type NotificationRecord = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  docType: "invoice" | "po" | "memo" | "pr" | null;
  docId: string | null;
  isRead: boolean;
  createdAt: string;
};

/** Daftar notifikasi milik pengguna sesi (terbaru dulu, dibatasi 30). */
export async function listNotificationsAction(): Promise<NotificationRecord[]> {
  const user = await getSessionUserAction();
  if (!user) return [];

  return db
    .select({
      id: notifications.id,
      type: notifications.type,
      title: notifications.title,
      body: notifications.body,
      docType: notifications.docType,
      docId: notifications.docId,
      isRead: notifications.isRead,
      createdAt: notifications.createdAt,
    })
    .from(notifications)
    .where(eq(notifications.userId, user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(30);
}

/** Jumlah notifikasi belum dibaca — dipakai badge pada lonceng. */
export async function getUnreadCountAction(): Promise<number> {
  const user = await getSessionUserAction();
  if (!user) return 0;

  const rows = await db
    .select({ id: notifications.id })
    .from(notifications)
    .where(
      and(eq(notifications.userId, user.id), eq(notifications.isRead, false))
    );

  return rows.length;
}

/** Menandai satu notifikasi sebagai sudah dibaca (hanya milik pengguna sesi). */
export async function markNotificationReadAction(
  id: string
): Promise<{ success: boolean }> {
  const user = await requireSessionUser();
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.id, id), eq(notifications.userId, user.id)));

  return { success: true };
}

/** Menandai semua notifikasi pengguna sesi sebagai sudah dibaca. */
export async function markAllNotificationsReadAction(): Promise<{
  success: boolean;
}> {
  const user = await requireSessionUser();
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.userId, user.id));

  return { success: true };
}
