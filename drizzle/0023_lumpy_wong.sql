CREATE TABLE `goods_receipts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`company_id` text,
	`supplier_id` text,
	`grn_number` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`receipt_date` text NOT NULL,
	`po_reference` text,
	`parent_id` text,
	`notes` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `goods_receipts_user_id_idx` ON `goods_receipts` (`user_id`);--> statement-breakpoint
CREATE INDEX `goods_receipts_status_idx` ON `goods_receipts` (`status`);--> statement-breakpoint
CREATE INDEX `goods_receipts_receipt_date_idx` ON `goods_receipts` (`receipt_date`);--> statement-breakpoint
CREATE TABLE `grn_items` (
	`id` text PRIMARY KEY NOT NULL,
	`grn_id` text NOT NULL,
	`group_label` text,
	`description` text NOT NULL,
	`quantity` real NOT NULL,
	`unit` text,
	`price` real DEFAULT 0 NOT NULL,
	FOREIGN KEY (`grn_id`) REFERENCES `goods_receipts`(`id`) ON UPDATE no action ON DELETE cascade
);
