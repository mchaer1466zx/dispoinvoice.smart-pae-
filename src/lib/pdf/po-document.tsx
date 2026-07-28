import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { formatCurrency, formatDate } from "@/lib/format";
import { calculateInvoiceTotals } from "@/lib/invoice-totals";

const STATUS_LABELS: Record<string, string> = {
  draft: "Draf",
  dikirim: "Dikirim",
  selesai: "Selesai",
};

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 10,
    color: "#111827",
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 16,
    marginBottom: 16,
  },
  companyBlock: { flexDirection: "row", gap: 12, alignItems: "center" },
  logo: { width: 40, height: 40, objectFit: "contain" },
  companyName: { fontSize: 12, fontWeight: 700 },
  muted: { color: "#6b7280" },
  poTitle: { fontSize: 18, fontWeight: 700, textAlign: "right" },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  metaLabel: { color: "#6b7280", marginBottom: 2 },
  table: { marginTop: 8 },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 6,
    color: "#6b7280",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 6,
  },
  colDescription: { flex: 3 },
  colQty: { flex: 1, textAlign: "right" },
  colPrice: { flex: 1.5, textAlign: "right" },
  colSubtotal: { flex: 1.5, textAlign: "right" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  totalLabel: { fontWeight: 700, marginRight: 24 },
  totalValue: { fontWeight: 700 },
  summaryBlock: { marginTop: 12, marginLeft: "auto", width: 220 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  summaryMuted: { color: "#6b7280" },
  summaryTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  notes: { marginTop: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#e5e7eb" },
  qrFooter: { marginTop: 32, flexDirection: "row", justifyContent: "flex-end" },
  qrImage: { width: 71, height: 71 },
  qrCaption: { marginTop: 2, fontSize: 6, color: "#6b7280", textAlign: "center" },
});

export type PoPdfCompany = {
  name: string;
  address: string;
  email: string | null;
  phone: string | null;
  logoSource: string | null;
};

export type PoPdfSupplier = {
  name: string;
  address: string;
  contactInfo: string;
} | null;

export type PoPdfItem = {
  description: string;
  quantity: number;
  price: number;
};

export type PoPdfData = {
  poNumber: string;
  orderDate: string;
  status: "draft" | "dikirim" | "selesai";
  tax: number;
  discount: number;
  notes: string | null;
  company: PoPdfCompany;
  supplier: PoPdfSupplier;
  items: PoPdfItem[];
  verificationQrDataUrl: string | null;
};

export function PoDocument({ data }: { data: PoPdfData }) {
  const totals = calculateInvoiceTotals(data.items, data.tax, data.discount);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.companyBlock}>
            {data.company.logoSource ? (
              // eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer's Image is not an HTML img element
              <Image style={styles.logo} src={data.company.logoSource} />
            ) : null}
            <View>
              <Text style={styles.companyName}>{data.company.name}</Text>
              <Text style={styles.muted}>{data.company.address}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.poTitle}>PURCHASE ORDER</Text>
            <Text style={styles.muted}>{data.poNumber}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View>
            <Text style={styles.metaLabel}>Kepada Pemasok</Text>
            {data.supplier ? (
              <View>
                <Text style={{ fontWeight: 700 }}>{data.supplier.name}</Text>
                <Text style={styles.muted}>{data.supplier.address}</Text>
                <Text style={styles.muted}>{data.supplier.contactInfo}</Text>
              </View>
            ) : (
              <Text style={styles.muted}>Belum ada pemasok dipilih.</Text>
            )}
          </View>
          <View>
            <Text style={styles.metaLabel}>Tanggal Pemesanan</Text>
            <Text style={{ marginBottom: 6 }}>{formatDate(data.orderDate)}</Text>
            <Text style={styles.metaLabel}>Status</Text>
            <Text>{STATUS_LABELS[data.status] ?? data.status}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.colDescription}>Deskripsi</Text>
            <Text style={styles.colQty}>Jumlah</Text>
            <Text style={styles.colPrice}>Harga</Text>
            <Text style={styles.colSubtotal}>Subtotal</Text>
          </View>
          {data.items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.colDescription}>{item.description || "-"}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{formatCurrency(item.price)}</Text>
              <Text style={styles.colSubtotal}>
                {formatCurrency(item.quantity * item.price)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryBlock}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryMuted}>Subtotal</Text>
            <Text style={styles.summaryMuted}>
              {formatCurrency(totals.subtotal)}
            </Text>
          </View>
          {totals.discount > 0 ? (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryMuted}>Diskon</Text>
              <Text style={styles.summaryMuted}>
                -{formatCurrency(totals.discount)}
              </Text>
            </View>
          ) : null}
          {totals.taxPercent > 0 ? (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryMuted}>PPN ({totals.taxPercent}%)</Text>
              <Text style={styles.summaryMuted}>
                {formatCurrency(totals.taxAmount)}
              </Text>
            </View>
          ) : null}
          <View style={styles.summaryTotalRow}>
            <Text style={styles.totalValue}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(totals.total)}</Text>
          </View>
        </View>

        {data.notes ? (
          <View style={styles.notes}>
            <Text style={styles.metaLabel}>Catatan</Text>
            <Text>{data.notes}</Text>
          </View>
        ) : null}

        {data.verificationQrDataUrl ? (
          <View style={styles.qrFooter}>
            <View>
              {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer's Image is not an HTML img element */}
              <Image style={styles.qrImage} src={data.verificationQrDataUrl} />
              <Text style={styles.qrCaption}>Pindai untuk verifikasi</Text>
            </View>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
