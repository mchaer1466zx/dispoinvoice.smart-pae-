CREATE INDEX `invoices_user_id_idx` ON `invoices` (`user_id`);--> statement-breakpoint
CREATE INDEX `invoices_status_idx` ON `invoices` (`status`);--> statement-breakpoint
CREATE INDEX `invoices_issue_date_idx` ON `invoices` (`issue_date`);--> statement-breakpoint
CREATE INDEX `memos_user_id_idx` ON `memos` (`user_id`);--> statement-breakpoint
CREATE INDEX `memos_memo_date_idx` ON `memos` (`memo_date`);--> statement-breakpoint
CREATE INDEX `purchase_orders_user_id_idx` ON `purchase_orders` (`user_id`);--> statement-breakpoint
CREATE INDEX `purchase_orders_status_idx` ON `purchase_orders` (`status`);--> statement-breakpoint
CREATE INDEX `purchase_orders_order_date_idx` ON `purchase_orders` (`order_date`);