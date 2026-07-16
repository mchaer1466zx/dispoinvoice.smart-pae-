import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { formatDate } from "@/lib/format";

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
  memoTitle: { fontSize: 18, fontWeight: 700, textAlign: "right" },
  metaRow: { marginBottom: 24 },
  metaLine: { flexDirection: "row", marginBottom: 4 },
  metaLabel: { color: "#6b7280", width: 90 },
  section: { marginTop: 16 },
  sectionLabel: { color: "#6b7280", marginBottom: 4 },
  sectionContent: { lineHeight: 1.5 },
  qrFooter: { marginTop: 32, flexDirection: "row", justifyContent: "flex-end" },
  qrImage: { width: 71, height: 71 },
  qrCaption: { marginTop: 2, fontSize: 6, color: "#6b7280", textAlign: "center" },
});

export type MemoPdfCompany = {
  name: string;
  address: string;
  logoSource: string | null;
};

export type MemoPdfData = {
  recipientName: string;
  subject: string;
  instructions: string | null;
  content: string;
  memoDate: string;
  company: MemoPdfCompany;
  verificationQrDataUrl: string | null;
};

export function MemoDocument({ data }: { data: MemoPdfData }) {
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
            <Text style={styles.memoTitle}>MEMO DISPOSISI</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaLine}>
            <Text style={styles.metaLabel}>Kepada</Text>
            <Text>{data.recipientName}</Text>
          </View>
          <View style={styles.metaLine}>
            <Text style={styles.metaLabel}>Tanggal</Text>
            <Text>{formatDate(data.memoDate)}</Text>
          </View>
          <View style={styles.metaLine}>
            <Text style={styles.metaLabel}>Perihal</Text>
            <Text>{data.subject || "-"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Isi Memo</Text>
          <Text style={styles.sectionContent}>{data.content}</Text>
        </View>

        {data.instructions ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Instruksi</Text>
            <Text style={styles.sectionContent}>{data.instructions}</Text>
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
