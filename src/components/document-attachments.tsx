"use client";

import { useEffect, useRef, useState } from "react";
import { FileUp, Loader2, Paperclip, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  listAttachmentsAction,
  removeAttachmentAction,
  uploadAttachmentAction,
  type AttachmentRecord,
} from "@/app/actions/attachments";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Panel "Lampiran Bukti": unggah & daftar berkas (scan penawaran, foto barang
 * datang, PDF invoice asli) untuk sebuah dokumen. Berkas disimpan di Vercel Blob.
 */
export function DocumentAttachments({
  entityType,
  entityId,
}: {
  entityType: string;
  entityId: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<AttachmentRecord[]>([]);
  const [uploading, setUploading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    listAttachmentsAction(entityType, entityId)
      .then((data) => {
        if (active) setItems(data);
      })
      .catch(() => {
        // Biarkan kosong bila gagal memuat.
      });
    return () => {
      active = false;
    };
  }, [entityType, entityId]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.set("file", file);

    setUploading(true);
    const result = await uploadAttachmentAction(entityType, entityId, formData);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";

    if (result.success) {
      setItems((prev) => [result.attachment, ...prev]);
      toast.success("Lampiran diunggah");
    } else {
      toast.error("Gagal mengunggah", { description: result.error });
    }
  }

  async function handleRemove(id: string) {
    setRemovingId(id);
    const result = await removeAttachmentAction(id);
    setRemovingId(null);

    if (result.success) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Lampiran dihapus");
    } else {
      toast.error("Gagal menghapus", { description: result.error });
    }
  }

  return (
    <div className="print:hidden">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Paperclip className="size-4" /> Lampiran Bukti
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <Loader2 className="animate-spin" /> : <FileUp />} Unggah
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Belum ada lampiran. Unggah scan penawaran, foto barang, atau PDF asli
          (PDF/JPG/PNG/WEBP, maks 4MB).
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 flex-col"
              >
                <span className="truncate font-medium underline underline-offset-2">
                  {item.filename}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatSize(item.size)}
                </span>
              </a>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Hapus lampiran"
                onClick={() => handleRemove(item.id)}
                disabled={removingId === item.id}
                className="text-destructive hover:text-destructive"
              >
                {removingId === item.id ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Trash2 />
                )}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
