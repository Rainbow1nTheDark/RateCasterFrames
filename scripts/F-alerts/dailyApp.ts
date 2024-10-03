import { DappRegistered, getRandomApp } from '../../app/database/apps';
import { fetchDappRatings } from '../on-chain/fetchFromSubgraph';
import axios from 'axios';
let currentDailyApp: DappRegistered & { averageRating?: number } | undefined;

export async function getHardcodedDailyApp(): Promise<DappRegistered & { averageRating?: number } | undefined> {
    // Get a new random app
    const app = await getRandomApp();
    if (!app) {
        console.error('No app found');
        await sendTelegramNotification('Error: No app Assigned');
        return undefined;
    }

    // Fetch ratings and calculate average
    const ratings = await fetchDappRatings();
    let averageRating: number | undefined;
    if (ratings && ratings.data) {
        const appRatings = ratings.data.dappRatingSubmitteds.filter(rating => rating.dappId === app.dapp_id);
        if (appRatings.length > 0) {
            const sum = appRatings.reduce((acc, rating) => acc + rating.starRating, 0);
            averageRating = sum / appRatings.length;
        }
    }

    currentDailyApp = { ...app, averageRating };

    // Send Telegram notification
    await sendTelegramNotification(app.name, averageRating);

    return currentDailyApp;
}

async function sendTelegramNotification(appName: string, averageRating?: number) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const ratingInfo = averageRating ? `\nAverage Rating: ${averageRating.toFixed(2)}` : '';
    const message = `Today's app is: ${appName}${ratingInfo}`;

    try {
        await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: chatId,
            text: message,
        });
        console.log('Telegram notification sent successfully');
    } catch (error) {
        console.error('Failed to send Telegram notification:', error);
    }
}

// Function to get the current daily app without fetching a new one
export function getCurrentDailyApp(): (DappRegistered & { averageRating?: number }) | undefined {
    if (!currentDailyApp) {
        console.log('No current daily app found');
        getHardcodedDailyApp();
    }
    return currentDailyApp;
}


