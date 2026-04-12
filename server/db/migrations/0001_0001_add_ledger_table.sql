CREATE TABLE `ledger_entry` (
	`id` text PRIMARY KEY NOT NULL,
	`person_id` text,
	`type` text NOT NULL,
	`category` text NOT NULL,
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
	CONSTRAINT "ledger_entry_split_type_chk" CHECK("ledger_entry"."type" = 'expense' or "ledger_entry"."is_split" = false)
);
--> statement-breakpoint
CREATE INDEX `ledger_entry_person_id_idx` ON `ledger_entry` (`person_id`);--> statement-breakpoint
CREATE INDEX `ledger_entry_type_idx` ON `ledger_entry` (`type`);--> statement-breakpoint
CREATE INDEX `ledger_entry_category_idx` ON `ledger_entry` (`category`);--> statement-breakpoint
CREATE INDEX `ledger_entry_paid_by_user_id_idx` ON `ledger_entry` (`paid_by_user_id`);--> statement-breakpoint
CREATE INDEX `ledger_entry_created_by_idx` ON `ledger_entry` (`created_by`);--> statement-breakpoint
CREATE INDEX `ledger_entry_updated_by_idx` ON `ledger_entry` (`updated_by`);