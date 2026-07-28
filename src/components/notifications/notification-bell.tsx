"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/lib/auth-store";
import {
  getUnreadCountAction,
  listNotificationsAction,
  markAllNotificationsReadAction,
  markNotificationReadAction,
  type NotificationRecord,
} from "@/app/actions/notifications";

/** Tujuan navigasi saat sebuah notifikasi diklik, berdasarkan dokumen terkait. */
function notificationHref(item: NotificationRecord): string | null {
  if (!item.docId) return null;
  // Semua jenis dokumen bisa dibuka lewat halaman detail riwayat.
  return `/riwayat-dokumen/${item.docId}`;
}

export function NotificationBell() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<NotificationRecord[]>([]);
  const [open, setOpen] = useState(false);

  // Ambil jumlah belum-dibaca saat login & tiap window kembali fokus.
  // (Saat belum login komponen tidak dirender, jadi state lama tak tampil.)
  // setState hanya dipanggil di dalam callback promise, bukan langsung di efek.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const loadCount = () => {
      getUnreadCountAction()
        .then((count) => {
          if (!cancelled) setUnread(count);
        })
        .catch(() => {
          if (!cancelled) setUnread(0);
        });
    };

    loadCount();
    window.addEventListener("focus", loadCount);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", loadCount);
    };
  }, [user]);

  async function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      try {
        setItems(await listNotificationsAction());
      } catch {
        setItems([]);
      }
    }
  }

  async function handleItemClick(item: NotificationRecord) {
    if (!item.isRead) {
      await markNotificationReadAction(item.id);
      setItems((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
      );
      setUnread((c) => Math.max(0, c - 1));
    }
    const href = notificationHref(item);
    if (href) {
      setOpen(false);
      router.push(href);
    }
  }

  async function handleMarkAll() {
    await markAllNotificationsReadAction();
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnread(0);
  }

  if (isLoading || !user) return null;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative"
          aria-label="Notifikasi"
        >
          <Bell />
          {unread > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full px-1 text-[10px] tabular-nums"
            >
              {unread > 9 ? "9+" : unread}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <p className="text-sm font-semibold">Notifikasi</p>
          {items.some((n) => !n.isRead) && (
            <Button
              variant="ghost"
              size="xs"
              className="gap-1 text-xs text-muted-foreground"
              onClick={handleMarkAll}
            >
              <CheckCheck /> Tandai semua
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {items.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              Belum ada notifikasi.
            </p>
          ) : (
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleItemClick(item)}
                    className="flex w-full flex-col items-start gap-0.5 border-b px-3 py-2.5 text-left transition-colors last:border-b-0 hover:bg-muted"
                  >
                    <span className="flex w-full items-start gap-2">
                      {!item.isRead && (
                        <span
                          aria-hidden
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                        />
                      )}
                      <span
                        className={
                          item.isRead
                            ? "text-sm text-muted-foreground"
                            : "text-sm font-medium"
                        }
                      >
                        {item.title}
                      </span>
                    </span>
                    {item.body && (
                      <span className="pl-3.5 text-xs text-muted-foreground">
                        {item.body}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
