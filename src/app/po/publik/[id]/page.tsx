import { FileX2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PoPreview } from "@/components/po/po-preview";
import { getPublicPurchaseOrderAction } from "@/app/actions/po-public";

export default async function PublicPoPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const po = await getPublicPurchaseOrderAction(id);

  if (!po) {
    return (
      <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
        <main className="flex w-full max-w-md flex-col gap-4">
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <FileX2 className="size-8 text-muted-foreground" />
              <p className="font-medium">Tautan tidak valid</p>
              <p className="text-sm text-muted-foreground">
                Tautan pratinjau purchase order ini tidak valid atau dokumennya
                sudah tidak tersedia.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="flex w-full max-w-4xl flex-col gap-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold tracking-tight">
            Pratinjau Purchase Order
          </h1>
          <p className="text-sm text-muted-foreground">
            Dibagikan melalui tautan publik DispoInvoice.
          </p>
        </div>
        <PoPreview
          poDetail={{
            poNumber: po.poNumber,
            orderDate: po.orderDate,
            status: po.status,
            notes: po.notes ?? "",
          }}
          supplier={po.supplier}
          company={po.company}
          items={po.items}
        />
      </main>
    </div>
  );
}
