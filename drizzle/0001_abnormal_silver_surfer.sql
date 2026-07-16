CREATE TABLE `company_profile` (
	`id` text PRIMARY KEY DEFAULT 'default' NOT NULL,
	`name` text NOT NULL,
	`address` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`logo_url` text,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
