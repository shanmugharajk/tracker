CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`emoji` text NOT NULL,
	`color` text NOT NULL,
	`sort_order` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE TABLE `debt_accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`comment` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_debt_accounts_user_name` ON `debt_accounts` (`user_id`,`name`);--> statement-breakpoint
CREATE TABLE `debt_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`debt_account_id` integer NOT NULL,
	`amount` integer NOT NULL,
	`currency` text NOT NULL,
	`date` text NOT NULL,
	`comment` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`debt_account_id`) REFERENCES `debt_accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_debt_tx_account` ON `debt_transactions` (`debt_account_id`);--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`category_id` integer NOT NULL,
	`amount` integer NOT NULL,
	`currency` text NOT NULL,
	`date` text NOT NULL,
	`tag` text,
	`comment` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_expenses_user_currency` ON `expenses` (`user_id`,`currency`);--> statement-breakpoint
CREATE INDEX `idx_expenses_user_date` ON `expenses` (`user_id`,`date`);--> statement-breakpoint
CREATE INDEX `idx_expenses_user_category` ON `expenses` (`user_id`,`category_id`);