import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { fetchAllDapps } from '../on-chain/fetchOnchain'; // Import the new function
import pQueue from 'p-queue';
import { addApp, getAllApps } from '../../app/database/apps';
import { getDistinctFids } from '../../app/database/scores';

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
    const allApps = await getAllApps();
    const recipientFids = await getDistinctFids();

    for (const recipientFid of recipientFids) {
      queue.add(() => sendDirectMessage(Number(recipientFid), message)); // Convert string to number
    }

    await queue.onIdle(); // Wait for the queue to be empty
    console.log('All messages have been sent');
  } catch (error) {
    console.error('Error reading data or sending messages:', error);
  }
}

// Function to fetch and store all Dapps in the database
export async function fetchAndStoreAllDappsInDB() {
  try {
    const dapps = await fetchAllDapps(); // OnChain

    for (const dapp of dapps) {
      // Check if the dapp already exists in the database
      const existingDapps = await getAllApps();
      const existingDapp = existingDapps.find((existing: { dapp_id: string; }) => existing.dapp_id === dapp.dappId);

      if (!existingDapp) {
        // Insert the new dapp into the database
        await addApp(dapp.name, dapp.imageUrl, dapp.dappId, DEFAULT_PLATFORM, dapp.url, dapp.description);
        console.log(`New Dapp added: ${dapp.dappId}`);
        const message = `New Farcaster ${dapp.category ? dapp.category.charAt(0).toUpperCase() + dapp.category.slice(1) : 'App'} Released: ${dapp.name}\n`;
        sendMessagesToAllIds(message);
      }
    }

    console.log('All Dapps have been fetched and stored in the database');
  } catch (error) {
    console.error('Error fetching and storing Dapps in the database:', error);
  }
}

// Function to check for new Dapps and send alerts
export async function checkNewDappsAndAlert() {
  try {
    const storedDapps = await getAllApps();
    const storedDappIds = new Set(storedDapps.map((dapp: { dapp_id: string }) => dapp.dapp_id.toLowerCase()));

    const dapps = await fetchAllDapps(); // Use the new function
    const newDapps = dapps.filter((dapp: { dappId: string }) => {
      const isNew = !storedDappIds.has(dapp.dappId.toLowerCase());
      if (isNew) {
        console.log(`New Dapp found: ${dapp.dappId}`);
      }
      return isNew;
    });

    if (newDapps.length > 0) {
      // Send alerts only for new Dapps
      for (const dapp of newDapps) {
        await sendMessagesToAllIds(`New Dapp registered: ${dapp.dappId}`);
      }

      // Update the stored Dapps in the database
      for (const dapp of newDapps) {
        await addApp(dapp.name, dapp.imageUrl, dapp.dappId, DEFAULT_PLATFORM, dapp.url, dapp.description);
      }

      console.log(`Processed ${newDapps.length} new Dapps`);
    } else {
      console.log('No new Dapps found');
    }
  } catch (error) {
    console.error('Error checking for new Dapps:', error);
  }
}

// Function to periodically check for new Dapps
function startPeriodicCheck() {
  setInterval(checkNewDappsAndAlert, 3600000); // Check every 1 hour
}

// Initial fetch and store of all Dapps
fetchAndStoreAllDappsInDB().then(() => {
  startPeriodicCheck();
});

// // Example usage
// export async function exampleUsage() {
//   const message = 'This is a programmatic Direct Cast';
//   await sendMessagesToAllIds(message);
// }