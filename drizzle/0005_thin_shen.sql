CREATE TABLE `memos` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`company_id` text,
	`recipient_name` text NOT NULL,
	`subject` text NOT NULL,
	`instructions` text,
	`content` text NOT NULL,
	`memo_date` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE set null
);
