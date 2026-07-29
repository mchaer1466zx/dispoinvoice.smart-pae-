CREATE TABLE `supplier_invoice_items` (
	`id` text PRIMARY KEY NOT NULL,
	`supplier_invoice_id` text NOT NULL,
	`group_label` text,
	`description` text NOT NULL,
	`quantity` real NOT NULL,
	`unit` text,
	`price` real DEFAULT 0 NOT NULL,
	FOREIGN KEY (`supplier_invoice_id`) REFERENCES `supplier_invoices`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `supplier_invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`company_id` text,
	`supplier_id` text,
	`invoice_number` text NOT NULL,
	`supplier_ref` text,
	`po_reference` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`invoice_date` text NOT NULL,
	`due_date` text,
	`tax` real DEFAULT 0 NOT NULL,
	`discount` real DEFAULT 0 NOT NULL,
	`parent_id` text,
	`notes` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `supplier_invoices_user_id_idx` ON `supplier_invoices` (`user_id`);--> statement-breakpoint
CREATE INDEX `supplier_invoices_status_idx` ON `supplier_invoices` (`status`);--> statement-breakpoint
CREATE INDEX `supplier_invoices_invoice_date_idx` ON `supplier_invoices` (`invoice_date`);