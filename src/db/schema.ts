import { sql } from "drizzle-orm";
import {
  index,
  sqliteTable,
  text,
  integer,
  real,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  resetToken: text("reset_token"),
  resetTokenExpiresAt: text("reset_token_expires_at"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const customers = sqliteTable("customers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const invoices = sqliteTable(
  "invoices",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id"),
    companyId: text("company_id").references(() => companies.id, {
      onDelete: "set null",
    }),
    customerId: text("customer_id").references(() => customers.id, {
      onDelete: "set null",
    }),
    invoiceNumber: text("invoice_number").notNull(),
    status: text("status", { enum: ["draft", "terkirim", "lunas"] })
      .notNull()
      .default("draft"),
    issueDate: text("issue_date").notNull(),
    dueDate: text("due_date"),
    notes: text("notes"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => [
    index("invoices_user_id_idx").on(table.userId),
    index("invoices_status_idx").on(table.status),
    index("invoices_issue_date_idx").on(table.issueDate),
  ]
);

export const invoiceItems = sqliteTable("invoice_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  invoiceId: text("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
});

export const suppliers = sqliteTable("suppliers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  contactInfo: text("contact_info").notNull(),
  address: text("address").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const purchaseOrders = sqliteTable(
  "purchase_orders",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id"),
    companyId: text("company_id").references(() => companies.id, {
      onDelete: "set null",
    }),
    supplierId: text("supplier_id").references(() => suppliers.id, {
      onDelete: "set null",
    }),
    poNumber: text("po_number").notNull(),
    status: text("status", { enum: ["draft", "dikirim", "selesai"] })
      .notNull()
      .default("draft"),
    orderDate: text("order_date").notNull(),
    notes: text("notes"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => [
    index("purchase_orders_user_id_idx").on(table.userId),
    index("purchase_orders_status_idx").on(table.status),
    index("purchase_orders_order_date_idx").on(table.orderDate),
  ]
);

export const poItems = sqliteTable("po_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  poId: text("po_id")
    .notNull()
    .references(() => purchaseOrders.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
});

export const memos = sqliteTable(
  "memos",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id"),
    companyId: text("company_id").references(() => companies.id, {
      onDelete: "set null",
    }),
    recipientName: text("recipient_name").notNull(),
    subject: text("subject").notNull(),
    instructions: text("instructions"),
    content: text("content").notNull(),
    status: text("status", { enum: ["terkirim", "dibaca", "selesai"] })
      .notNull()
      .default("terkirim"),
    memoDate: text("memo_date").notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => [
    index("memos_user_id_idx").on(table.userId),
    index("memos_status_idx").on(table.status),
    index("memos_memo_date_idx").on(table.memoDate),
  ]
);

/**
 * Notifikasi in-app untuk karyawan (lonceng di header). Penerima = users.id.
 * `userId` nullable selama audit trail (created_by) belum mengisi pemilik dokumen.
 * `dedupeKey` menjaga notifikasi otomatis (mis. reminder due date) tidak berganda.
 */
export const notifications = sqliteTable(
  "notifications",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    type: text("type", {
      enum: [
        "invoice_status",
        "po_status",
        "memo_status",
        "doc_shared",
        "invoice_due_soon",
        "invoice_overdue",
      ],
    }).notNull(),
    title: text("title").notNull(),
    body: text("body"),
    docType: text("doc_type", { enum: ["invoice", "po", "memo"] }),
    docId: text("doc_id"),
    isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
    dedupeKey: text("dedupe_key"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => [
    index("notifications_user_id_idx").on(table.userId),
    index("notifications_is_read_idx").on(table.isRead),
    uniqueIndex("notifications_dedupe_key_uq").on(table.dedupeKey),
  ]
);

/** Perusahaan yang dapat dipilih sebagai penerbit invoice/PO/memo (multi company). */
export const companies = sqliteTable("companies", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  address: text("address").notNull(),
  email: text("email"),
  phone: text("phone"),
  logoUrl: text("logo_url"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});
