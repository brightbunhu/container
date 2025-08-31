import seedData from '../src/lib/seed';

async function main() {
  console.log('Starting database seeding...');
  await seedData();
  console.log('Database seeding completed!');
  process.exit(0);
}

main().catch((error) => {
  console.error('Error during seeding:', error);
  process.exit(1);
});


