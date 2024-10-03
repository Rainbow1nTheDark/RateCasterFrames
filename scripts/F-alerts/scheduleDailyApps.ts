import dotenv from 'dotenv';
dotenv.config();

import cron from 'node-cron';
import { getHardcodedDailyApp, getCurrentDailyApp } from './dailyApp';

export async function initializeDailyApp() {
    console.log('Initializing daily app');
    if (!getCurrentDailyApp()) {
        await getHardcodedDailyApp();
    }
}

// // Initialize the app immediately when the script starts
// initializeDailyApp();

// Schedule the task to run at 10 AM EST every day
cron.schedule('0 10 * * *', async () => {
    console.log('Running daily app update');
    await getHardcodedDailyApp();
}, {
    scheduled: true,
    timezone: "America/New_York"
});

console.log('Daily app scheduler started');