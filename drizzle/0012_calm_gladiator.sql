ALTER TABLE `invoices` ADD `tax` real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` ADD `discount` real DEFAULT 0 NOT NULL;