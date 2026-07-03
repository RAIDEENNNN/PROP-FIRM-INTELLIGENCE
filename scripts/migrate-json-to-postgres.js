import { migrateJsonToPostgres, usingPostgres } from '../storage.js';

if (!usingPostgres()) {
  console.error('DATABASE_URL is required. Example: DATABASE_URL="postgresql://..." npm run db:migrate');
  process.exit(1);
}

try {
  const db = await migrateJsonToPostgres();
  console.log('FundScope migration complete.');
  console.log(`Users: ${db.users.length}`);
  console.log(`Firms: ${db.firms.length}`);
  console.log(`Discount codes: ${db.discountCodes.length}`);
  console.log(`News items: ${db.news.length}`);
  console.log(`Rule changes: ${db.ruleChanges.length}`);
  console.log(`Alerts: ${db.alerts.length}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
