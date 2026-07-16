import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_LABELS: Record<string, string> = {
  draft: "Draf",
  terkirim: "Terkirim",
  lunas: "Lunas",
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
  invoiceTitle: { fontSize: 18, fontWeight: 700, textAlign: "right" },
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
  notes: { marginTop: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#e5e7eb" },
  qrFooter: { marginTop: 32, flexDirection: "row", justifyContent: "flex-end" },
  qrImage: { width: 71, height: 71 },
  qrCaption: { marginTop: 2, fontSize: 6, color: "#6b7280", textAlign: "center" },
});

export type InvoicePdfCompany = {
  name: string;
  address: string;
  logoSource: string | null;
};

export type InvoicePdfCustomer = {
  name: string;
  address: string;
  email: string;
  phone: string;
} | null;

export type InvoicePdfItem = {
  description: string;
  quantity: number;
  price: number;
};

export type InvoicePdfData = {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: "draft" | "terkirim" | "lunas";
  notes: string | null;
  company: InvoicePdfCompany;
  customer: InvoicePdfCustomer;
  items: InvoicePdfItem[];
  verificationQrDataUrl: string | null;
};

export function InvoiceDocument({ data }: { data: InvoicePdfData }) {
  const total = data.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

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
              <Text style={styles.muted}>
                {data.company.email} · {data.company.phone}
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.muted}>{data.invoiceNumber}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View>
            <Text style={styles.metaLabel}>Ditagih kepada</Text>
            {data.customer ? (
              <View>
                <Text style={{ fontWeight: 700 }}>{data.customer.name}</Text>
                <Text style={styles.muted}>{data.customer.address}</Text>
                <Text style={styles.muted}>{data.customer.email}</Text>
                <Text style={styles.muted}>{data.customer.phone}</Text>
              </View>
            ) : (
              <Text style={styles.muted}>Belum ada pelanggan dipilih.</Text>
            )}
          </View>
          <View>
            <Text style={styles.metaLabel}>Tanggal Terbit</Text>
            <Text style={{ marginBottom: 6 }}>{formatDate(data.issueDate)}</Text>
            <Text style={styles.metaLabel}>Jatuh Tempo</Text>
            <Text style={{ marginBottom: 6 }}>{formatDate(data.dueDate)}</Text>
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

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
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
