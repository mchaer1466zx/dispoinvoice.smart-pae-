DROP INDEX "attachments_entity_idx";--> statement-breakpoint
DROP INDEX "audit_logs_entity_idx";--> statement-breakpoint
DROP INDEX "invoices_user_id_idx";--> statement-breakpoint
DROP INDEX "invoices_status_idx";--> statement-breakpoint
DROP INDEX "invoices_issue_date_idx";--> statement-breakpoint
DROP INDEX "memos_user_id_idx";--> statement-breakpoint
DROP INDEX "memos_status_idx";--> statement-breakpoint
DROP INDEX "memos_memo_date_idx";--> statement-breakpoint
DROP INDEX "notifications_user_id_idx";--> statement-breakpoint
DROP INDEX "notifications_is_read_idx";--> statement-breakpoint
DROP INDEX "notifications_dedupe_key_uq";--> statement-breakpoint
DROP INDEX "purchase_orders_user_id_idx";--> statement-breakpoint
DROP INDEX "purchase_orders_status_idx";--> statement-breakpoint
DROP INDEX "purchase_orders_order_date_idx";--> statement-breakpoint
DROP INDEX "purchase_requests_user_id_idx";--> statement-breakpoint
DROP INDEX "purchase_requests_status_idx";--> statement-breakpoint
DROP INDEX "sessions_user_id_idx";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `po_items` ALTER COLUMN "quantity" TO "quantity" real NOT NULL;--> statement-breakpoint
CREATE INDEX `attachments_entity_idx` ON `attachments` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `audit_logs_entity_idx` ON `audit_logs` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `invoices_user_id_idx` ON `invoices` (`user_id`);--> statement-breakpoint
CREATE INDEX `invoices_status_idx` ON `invoices` (`status`);--> statement-breakpoint
CREATE INDEX `invoices_issue_date_idx` ON `invoices` (`issue_date`);--> statement-breakpoint
CREATE INDEX `memos_user_id_idx` ON `memos` (`user_id`);--> statement-breakpoint
CREATE INDEX `memos_status_idx` ON `memos` (`status`);--> statement-breakpoint
CREATE INDEX `memos_memo_date_idx` ON `memos` (`memo_date`);--> statement-breakpoint
CREATE INDEX `notifications_user_id_idx` ON `notifications` (`user_id`);--> statement-breakpoint
CREATE INDEX `notifications_is_read_idx` ON `notifications` (`is_read`);--> statement-breakpoint
CREATE UNIQUE INDEX `notifications_dedupe_key_uq` ON `notifications` (`dedupe_key`);--> statement-breakpoint
CREATE INDEX `purchase_orders_user_id_idx` ON `purchase_orders` (`user_id`);--> statement-breakpoint
CREATE INDEX `purchase_orders_status_idx` ON `purchase_orders` (`status`);--> statement-breakpoint
CREATE INDEX `purchase_orders_order_date_idx` ON `purchase_orders` (`order_date`);--> statement-breakpoint
CREATE INDEX `purchase_requests_user_id_idx` ON `purchase_requests` (`user_id`);--> statement-breakpoint
CREATE INDEX `purchase_requests_status_idx` ON `purchase_requests` (`status`);--> statement-breakpoint
CREATE INDEX `sessions_user_id_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `po_items` ADD `group_label` text;--> statement-breakpoint
ALTER TABLE `po_items` ADD `unit` text;--> statement-breakpoint
ALTER TABLE `pr_items` ALTER COLUMN "quantity" TO "quantity" real NOT NULL;--> statement-breakpoint
ALTER TABLE `pr_items` ADD `group_label` text;--> statement-breakpoint
ALTER TABLE `pr_items` ADD `unit` text;