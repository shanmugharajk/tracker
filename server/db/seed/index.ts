import { seedUser } from './user';
import { seedExpenseEntries } from './expense';

async function seed() {
  console.log('\n🚀 Seeding started');
  const userIds = await seedUser();
  await seedExpenseEntries(userIds);
}

seed()
  .then(() => console.log('🌱 Seeded successfully!'))
  .catch((err) => console.error('❌ Seeding failed:', err));
