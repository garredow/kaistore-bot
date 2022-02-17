import cron from 'node-cron';
import { checkNewApps } from './jobs';

checkNewApps();

cron.schedule('0 * * * *', checkNewApps);
