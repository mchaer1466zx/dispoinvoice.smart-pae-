DROP TABLE `company_profile`;--> statement-breakpoint
ALTER TABLE `invoices` ADD `company_id` text REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `purchase_orders` ADD `company_id` text REFERENCES companies(id);