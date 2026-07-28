"use client";

import { useEffect, useState } from "react";
import { History } from "lucide-react";
import {
  listAuditLogsAction,
  type AuditLogRecord,
} from "@/app/actions/audit";

const ACTION_LABELS: Record<string, string> = {
  create: "Dibuat",
  update: "Diubah",
  approve: "Disetujui",
  reject: "Ditolak",
  cancel: "Dibatalkan",
};

/** Meringkas isi kolom changes (JSON) menjadi teks singkat, mis. "status: draft → lunas". */
function summarizeChanges(changes: string | null): string | null {
  if (!changes) return null;
  try {
    const parsed = JSON.parse(changes) as Record<
      string,
      { from: unknown; to: unknown }
    >;
    return Object.entries(parsed)
      .map(([field, { from, to }]) => `${field}: ${String(from)} → ${String(to)}`)
      .join(", ");
  } catch {
    return null;
  }
}

function formatTimestamp(value: string): string {
  const date = value.includes("T") ? new Date(value) : new Date(`${value}Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

/**
 * Panel "Riwayat Perubahan": menampilkan jejak audit sebuah dokumen (siapa, kapan,
 * apa). `reloadToken` yang berubah memicu pemuatan ulang (mis. setelah pembatalan).
 */
export function DocumentAuditPanel({
  entityType,
  entityId,
  reloadToken = 0,
}: {
  entityType: string;
  entityId: string;
  reloadToken?: number;
}) {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);

  useEffect(() => {
    let active = true;
    listAuditLogsAction(entityType, entityId)
      .then((data) => {
        if (active) setLogs(data);
      })
      .catch(() => {
        // Biarkan kosong bila gagal memuat.
      });
    return () => {
      active = false;
    };
  }, [entityType, entityId, reloadToken]);

  if (logs.length === 0) return null;

  return (
    <div className="print:hidden">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <History className="size-4" /> Riwayat Perubahan
      </div>
      <ul className="flex flex-col gap-2">
        {logs.map((log) => {
          const summary = summarizeChanges(log.changes);
          return (
            <li
              key={log.id}
              className="rounded-md border px-3 py-2 text-sm"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <span className="font-medium">
                  {ACTION_LABELS[log.action] ?? log.action}
                  {log.actorName ? ` oleh ${log.actorName}` : ""}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(log.createdAt)}
                </span>
              </div>
              {summary ? (
                <p className="text-xs text-muted-foreground">{summary}</p>
              ) : null}
              {log.reason ? (
                <p className="text-xs text-muted-foreground">
                  Alasan: {log.reason}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
