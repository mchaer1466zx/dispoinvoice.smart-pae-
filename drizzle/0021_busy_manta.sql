ALTER TABLE `users` ADD `role` text DEFAULT 'staff' NOT NULL;
--> statement-breakpoint
UPDATE `users` SET `role` = 'admin' WHERE `id` = (SELECT `id` FROM `users` ORDER BY `created_at` ASC, `email` ASC LIMIT 1);