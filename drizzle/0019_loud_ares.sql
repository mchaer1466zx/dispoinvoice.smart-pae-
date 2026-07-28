CREATE TABLE `pr_items` (
	`id` text PRIMARY KEY NOT NULL,
	`pr_id` text NOT NULL,
	`description` text NOT NULL,
	`spec` text,
	`quantity` integer NOT NULL,
	`est_price` real NOT NULL,
	FOREIGN KEY (`pr_id`) REFERENCES `purchase_requests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `purchase_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`company_id` text,
	`pr_number` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`department` text,
	`need_date` text,
	`notes` text,
	`parent_id` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `purchase_requests_user_id_idx` ON `purchase_requests` (`user_id`);--> statement-breakpoint
CREATE INDEX `purchase_requests_status_idx` ON `purchase_requests` (`status`);