import { seedCategories } from "./categories";
import { seedDebtAccounts } from "./debt-accounts";
import { seedDebtTransactions } from "./debt-transactions";
import { seedExpenses } from "./expenses";
import { seedUsers } from "./users";

async function main() {
  try {
    await seedUsers();
    await seedCategories();
    await seedExpenses();
    await seedDebtAccounts();
    await seedDebtTransactions();
    console.log("\n🌱 ✓ All seeds completed successfully");
  } catch (error) {
    console.error("✗ Seeding failed:", error);
    process.exit(1);
  }
}

main();
