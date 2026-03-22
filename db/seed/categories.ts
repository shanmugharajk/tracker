import { sql } from "drizzle-orm";

import { db, schema } from "~/db";

const CATEGORIES = [
  { id: 1, name: "Food", emoji: "🍔", color: "#F97316", sortOrder: 1 },
  { id: 2, name: "Transport", emoji: "🚗", color: "#3B82F6", sortOrder: 2 },
  { id: 3, name: "Home", emoji: "🏠", color: "#22C55E", sortOrder: 3 },
  { id: 4, name: "Lifestyle", emoji: "✨", color: "#A855F7", sortOrder: 4 },
  { id: 5, name: "Bills", emoji: "⚡", color: "#EAB308", sortOrder: 5 },
];

export async function seedCategories() {
  await db
    .insert(schema.categories)
    .values(CATEGORIES)
    .onConflictDoUpdate({
      target: schema.categories.id,
      set: {
        name: sql`excluded.name`,
        emoji: sql`excluded.emoji`,
        color: sql`excluded.color`,
        sortOrder: sql`excluded.sort_order`,
      },
    });

  console.log("✓ Seeded categories");
}
