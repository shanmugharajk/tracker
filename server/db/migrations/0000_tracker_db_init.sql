CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE TABLE `ledger_entry` (
	`id` text PRIMARY KEY NOT NULL,
	`person_id` text,
	`type` text NOT NULL,
	`category` text,
	`settlement_for` text,
	`tags` text,
	`amount` real NOT NULL,
	`paid_by_user_id` text,
	`is_split` integer DEFAULT false NOT NULL,
	`note` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`person_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`paid_by_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "ledger_entry_amount_positive_chk" CHECK("ledger_entry"."amount" > 0),
	CONSTRAINT "ledger_entry_split_type_chk" CHECK("ledger_entry"."type" = 'expense' or "ledger_entry"."is_split" = false),
	CONSTRAINT "ledger_entry_category_type_chk" CHECK("ledger_entry"."type" = 'settlement' or "ledger_entry"."category" is not null),
	CONSTRAINT "ledger_entry_category_settlement_null_chk" CHECK("ledger_entry"."type" != 'settlement' or "ledger_entry"."category" is null),
	CONSTRAINT "ledger_entry_settlement_for_type_chk" CHECK("ledger_entry"."type" != 'settlement' or "ledger_entry"."settlement_for" is not null),
	CONSTRAINT "ledger_entry_settlement_for_null_chk" CHECK("ledger_entry"."type" = 'settlement' or "ledger_entry"."settlement_for" is null)
);
--> statement-breakpoint
CREATE INDEX `ledger_entry_person_id_idx` ON `ledger_entry` (`person_id`);--> statement-breakpoint
CREATE INDEX `ledger_entry_type_idx` ON `ledger_entry` (`type`);--> statement-breakpoint
CREATE INDEX `ledger_entry_category_idx` ON `ledger_entry` (`category`);--> statement-breakpoint
CREATE INDEX `ledger_entry_settlement_for_idx` ON `ledger_entry` (`settlement_for`);--> statement-breakpoint
CREATE INDEX `ledger_entry_paid_by_user_id_idx` ON `ledger_entry` (`paid_by_user_id`);--> statement-breakpoint
CREATE INDEX `ledger_entry_created_by_idx` ON `ledger_entry` (`created_by`);--> statement-breakpoint
CREATE INDEX `ledger_entry_updated_by_idx` ON `ledger_entry` (`updated_by`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);