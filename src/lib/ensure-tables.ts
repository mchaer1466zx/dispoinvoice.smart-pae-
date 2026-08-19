import { client } from "@/db";

let initPromise: Promise<void> | null = null;

/**
 * Memastikan tabel-tabel SQLite esensial sudah dibuat (CREATE TABLE IF NOT EXISTS)
 * secara otomatis jika database belum dimigrasi (misal di SQLite lokal / serverless).
 */
export async function ensureDatabaseTables(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      await client.executeMultiple(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'staff',
          default_company TEXT NOT NULL DEFAULT 'KSP',
          reset_token TEXT,
          reset_token_expires_at TEXT,
          created_at TEXT NOT NULL DEFAULT (current_timestamp)
        );

        CREATE TABLE IF NOT EXISTS sessions (
          token TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          expires_at TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (current_timestamp)
        );

        CREATE TABLE IF NOT EXISTS companies (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          address TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          logo_url TEXT,
          created_at TEXT NOT NULL DEFAULT (current_timestamp),
          updated_at TEXT NOT NULL DEFAULT (current_timestamp)
        );

        CREATE TABLE IF NOT EXISTS customers (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          address TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (current_timestamp)
        );

        CREATE TABLE IF NOT EXISTS inventory_items (
          id TEXT PRIMARY KEY,
          sku TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          unit TEXT NOT NULL,
          min_stock REAL NOT NULL DEFAULT 0,
          current_stock REAL NOT NULL DEFAULT 0,
          cost_price REAL NOT NULL DEFAULT 0,
          selling_price REAL NOT NULL DEFAULT 0,
          description TEXT,
          company_id TEXT,
          created_at TEXT NOT NULL DEFAULT (current_timestamp),
          updated_at TEXT NOT NULL DEFAULT (current_timestamp)
        );

        CREATE TABLE IF NOT EXISTS stock_movements (
          id TEXT PRIMARY KEY,
          inventory_item_id TEXT NOT NULL,
          type TEXT NOT NULL,
          quantity REAL NOT NULL,
          balance_after REAL NOT NULL,
          reference_type TEXT NOT NULL DEFAULT 'manual',
          reference_id TEXT,
          notes TEXT,
          user_id TEXT,
          created_at TEXT NOT NULL DEFAULT (current_timestamp)
        );

        CREATE TABLE IF NOT EXISTS raw_materials (
          id TEXT PRIMARY KEY,
          material_name TEXT NOT NULL,
          stock_quantity REAL NOT NULL DEFAULT 0,
          unit TEXT NOT NULL DEFAULT 'kg',
          last_purchase_price REAL NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL DEFAULT (current_timestamp),
          updated_at TEXT NOT NULL DEFAULT (current_timestamp)
        );

        CREATE TABLE IF NOT EXISTS finished_goods (
          id TEXT PRIMARY KEY,
          product_name TEXT NOT NULL,
          current_stock INTEGER NOT NULL DEFAULT 0,
          current_hpp REAL NOT NULL DEFAULT 0,
          recommended_price REAL NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL DEFAULT (current_timestamp),
          updated_at TEXT NOT NULL DEFAULT (current_timestamp)
        );

        CREATE TABLE IF NOT EXISTS product_formulas (
          id TEXT PRIMARY KEY,
          product_id TEXT NOT NULL,
          material_id TEXT NOT NULL,
          required_quantity REAL NOT NULL,
          created_at TEXT NOT NULL DEFAULT (current_timestamp)
        );
      `);
    } catch {
      // Abaikan jika tabel sudah ada atau provider db readonly
    }
  })();

  return initPromise;
}
