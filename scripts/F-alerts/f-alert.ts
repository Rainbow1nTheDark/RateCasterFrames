import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { fetchAllDapps } from '../on-chain/fetchOnchain';
import pQueue from 'p-queue';
import { addApp, DappRegistered, getAllApps } from '../../app/database/apps';
import { getDistinctFids } from '../../app/database/scores';
import cron from 'node-cron';

const WARPCAST_API_KEY = process.env.WARPCAST_API_KEY;
const DEFAULT_ALERT_LEVEL = 1;
const DEFAULT_PLATFORM = 'farcaster';

// Initialize a queue with concurrency limit
const queue = new pQueue({ interval: 60000, intervalCap: 5 }); // 5 messages per minute

// Function to send a direct message
async function sendDirectMessage(recipientFid: number, message: string) {
  try {
    const url = 'https://api.warpcast.com/v2/ext-send-direct-cast';
    const headers = {
      'Authorization': `Bearer ${WARPCAST_API_KEY}`,
      'Content-Type': 'application/json'
    };
    const body = {
      recipientFid: recipientFid,
      message: message,
      idempotencyKey: uuidv4()  // Generate a unique idempotency key
    };
    const response = await axios.put(url, body, { headers });
    console.log(`Direct message sent to Farcaster ID: ${recipientFid}, response: ${response.status}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      console.error('Rate limit exceeded, retrying...');
      await new Promise(resolve => setTimeout(resolve, 60000)); // Wait for 1 minute before retrying
      await sendDirectMessage(recipientFid, message); // Retry sending the message
    } else {
      console.error('Error sending direct message:', error);
    }
  }
}

// Function to send messages to all IDs in the database
async function sendMessagesToAllIds(message: string) {
  try {
    const recipientFids = await getDistinctFids();

    for (const recipientFid of recipientFids) {
      if (DEFAULT_ALERT_LEVEL > 0) {
        queue.add(() => sendDirectMessage(Number(recipientFid), message));
      }
    }

    await queue.onIdle(); // Wait for the queue to be empty
    console.log('All messages have been sent');
  } catch (error) {
    console.error('Error reading data or sending messages:', error);
  }
}

// Function to fetch and store all Dapps in the database
async function fetchAndStoreAllDappsInDB() {
  try {
    const dapps = await fetchAllDapps();
    const existingDapps = await getAllApps();
    const existingDappIds = new Set(existingDapps.map((dapp: { dapp_id: string }) => dapp.dapp_id.toLowerCase()));

    let newDappsCount = 0;

    for (const dapp of dapps) {
      if (!existingDappIds.has(dapp.dappId.toLowerCase())) {
        await addApp(dapp.name, dapp.imageUrl, dapp.dappId, dapp.platform, dapp.url, dapp.description);
        newDappsCount++;
      }
    }

    if (newDappsCount > 0) {
      const message = `We got More Apps, Check and Rate them out at https://frames.ratecaster.xyz/frames !`;
      await sendMessagesToAllIds(message);
    }

    console.log(`Fetched and stored ${newDappsCount} new Dapps in the database`);
  } catch (error) {
    console.error('Error fetching and storing Dapps in the database:', error);
  }
}

// Function to check for new Dapps and send alerts
async function checkNewDappsAndAlert() {
  try {
    await fetchAndStoreAllDappsInDB();
  } catch (error) {
    console.error('Error checking for new Dapps:', error);
  }
}

// Function to start the periodic check based on alert levels
function startPeriodicCheck() {
  // Daily check at 9 AM EST
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily check for new Dapps');
    await checkNewDappsAndAlert();
  }, {
    timezone: "America/New_York"
  });

  // Weekly check (every Monday at 9 AM EST)
  cron.schedule('0 9 * * 1', async () => {
    console.log('Running weekly check for new Dapps');
    await checkNewDappsAndAlert();
  }, {
    timezone: "America/New_York"
  });

  // Monthly check (1st day of each month at 9 AM EST)
  cron.schedule('0 9 1 * *', async () => {
    console.log('Running monthly check for new Dapps');
    await checkNewDappsAndAlert();
  }, {
    timezone: "America/New_York"
  });
}

// Initial fetch and store of all Dapps
fetchAndStoreAllDappsInDB().then(() => {
  startPeriodicCheck();
});

export { checkNewDappsAndAlert };