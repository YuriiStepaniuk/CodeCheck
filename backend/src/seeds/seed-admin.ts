import { seedAdmin } from './admin.seed';
import { AppDataSource } from './data-source';

async function main() {
  await AppDataSource.initialize();
  await seedAdmin(AppDataSource);
  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
