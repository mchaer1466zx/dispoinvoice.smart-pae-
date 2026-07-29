CREATE TABLE `rfq_items` (
	`id` text PRIMARY KEY NOT NULL,
	`rfq_id` text NOT NULL,
	`group_label` text,
	`description` text NOT NULL,
	`quantity` real NOT NULL,
	`unit` text,
	`price` real DEFAULT 0 NOT NULL,
	FOREIGN KEY (`rfq_id`) REFERENCES `rfqs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `rfqs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`company_id` text,
	`supplier_id` text,
	`rfq_number` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`request_date` text NOT NULL,
	`deadline` text,
	`parent_id` text,
	`notes` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `rfqs_user_id_idx` ON `rfqs` (`user_id`);--> statement-breakpoint
CREATE INDEX `rfqs_status_idx` ON `rfqs` (`status`);--> statement-breakpoint
CREATE INDEX `rfqs_request_date_idx` ON `rfqs` (`request_date`);