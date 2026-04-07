import { seedUser } from './user';

async function seed() {
  await seedUser();
}

seed()
  .then(() => console.log('🌱 Seeded successfully!'))
  .catch((err) => console.error('❌ Seeding failed:', err));
