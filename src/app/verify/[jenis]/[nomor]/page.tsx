import { desc, eq } from "drizzle-orm";
import { CheckCircle2, FileX2 } from "lucide-react";
import { db } from "@/db";
import { customers, invoiceItems, invoices } from "@/db/schema";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  terkirim: "Terkirim",
  lunas: "Lunas",
};

function statusBadgeVariant(status: string): "outline" | "default" | "success" {
  if (status === "lunas") return "success";
  if (status === "terkirim") return "default";
  return "outline";
}

async function getInvoiceVerification(nomor: string) {
  const [invoice] = await db
    .select()
    .from(invoices)
    .where(eq(invoices.invoiceNumber, nomor))
    .orderBy(desc(invoices.createdAt))
    .limit(1);

  if (!invoice) return null;

  const items = await db
    .select()
    .from(invoiceItems)
    .where(eq(invoiceItems.invoiceId, invoice.id));
  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const customer = invoice.customerId
    ? ((
        await db
          .select()
          .from(customers)
          .where(eq(customers.id, invoice.customerId))
          .limit(1)
      )[0] ?? null)
    : null;

  return { invoice, total, customer };
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function NotFoundState({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
        <FileX2 className="size-8 text-muted-foreground" />
        <p className="font-medium">Dokumen tidak dapat diverifikasi</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}

function VerificationShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="flex w-full max-w-md flex-col gap-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold tracking-tight">
            Verifikasi Dokumen
          </h1>
          <p className="text-sm text-muted-foreground">
            Hasil pemindaian QR code dokumen DispoInvoice.
          </p>
        </div>
        {children}
      </main>
    </div>
  );
}

export default async function VerifyDocumentPage({
  params,
}: {
  params: Promise<{ jenis: string; nomor: string }>;
}) {
  const { jenis, nomor: rawNomor } = await params;
  const nomor = decodeURIComponent(rawNomor);

  if (jenis !== "invoice") {
    return (
      <VerificationShell>
        <NotFoundState
          message={`Verifikasi untuk jenis dokumen "${jenis}" belum didukung.`}
        />
      </VerificationShell>
    );
  }

  const result = await getInvoiceVerification(nomor);

  if (!result) {
    return (
      <VerificationShell>
        <NotFoundState
          message={`Dokumen dengan nomor "${nomor}" tidak ditemukan.`}
        />
      </VerificationShell>
    );
  }

  const { invoice, total, customer } = result;

  return (
    <VerificationShell>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-success">
            <CheckCircle2 className="size-5" />
            <CardTitle>Dokumen Terverifikasi</CardTitle>
          </div>
          <CardDescription>
            Invoice ini tercatat resmi di sistem DispoInvoice.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <Row label="Nomor Invoice" value={invoice.invoiceNumber} />
          <Row label="Tanggal Terbit" value={formatDate(invoice.issueDate)} />
          <Row label="Pihak Ditagih" value={customer?.name ?? "-"} />
          <Row label="Total" value={formatCurrency(total)} />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            <Badge variant={statusBadgeVariant(invoice.status)}>
              {STATUS_LABELS[invoice.status] ?? invoice.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </VerificationShell>
  );
}
