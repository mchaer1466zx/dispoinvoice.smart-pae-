ALTER TABLE `memos` ADD `status` text DEFAULT 'terkirim' NOT NULL;--> statement-breakpoint
CREATE INDEX `memos_status_idx` ON `memos` (`status`);