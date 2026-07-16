CREATE TABLE `po_items` (
	`id` text PRIMARY KEY NOT NULL,
	`po_id` text NOT NULL,
	`description` text NOT NULL,
	`quantity` integer NOT NULL,
	`price` real NOT NULL,
	FOREIGN KEY (`po_id`) REFERENCES `purchase_orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `purchase_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`supplier_id` text,
	`po_number` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`order_date` text NOT NULL,
	`notes` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`contact_info` text NOT NULL,
	`address` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
