import cron from 'node-cron';
import { Database } from './db';
import { checkNewApps } from './jobs';

function checkApps() {
  const db = new Database();

  checkNewApps(db)
    .catch((err) => console.log('Failed to check apps', err))
    .finally(() => db.disconnect());
}

checkApps();

cron.schedule('0 * * * *', checkApps);
