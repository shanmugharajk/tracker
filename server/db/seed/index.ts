import { seedUser } from './user';
import { seedLedgerEntries } from './ledger';

async function seed() {
  console.log('\n🚀 Seeding started');
  const userIds = await seedUser();
  await seedLedgerEntries(userIds);
}

seed()
  .then(() => console.log('🌱 Seeded successfully!'))
  .catch((err) => console.error('❌ Seeding failed:', err));
