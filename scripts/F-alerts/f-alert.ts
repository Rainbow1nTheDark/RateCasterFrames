import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { fetchGraphQLRegisteredDapps } from '../graphQL/fetchFromSubgraph';
import pQueue from 'p-queue';
import { readFileFromS3, writeFileToS3 } from '../aws/s3Utils';
import { addApp, getAllApps } from '../../app/database/apps';

const DATA_FILE_KEY = 'farcaster-ids.json';
const DAPPS_FILE_KEY = 'dapps.json';
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
    console.log(`Direct message sent to Farcaster ID: ${recipientFid}, response: ${response.data}`);
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

// Function to send messages to all IDs in the data file
async function sendMessagesToAllIds(message: string) {
  try {
    const fileContent = await readFileFromS3(DATA_FILE_KEY);
    const data = JSON.parse(fileContent);
    const recipientFids = Object.keys(data); // Extracting the keys as IDs

    for (const recipientFid of recipientFids) {
      queue.add(() => sendDirectMessage(Number(recipientFid), message)); // Convert string to number
    }

    await queue.onIdle(); // Wait for the queue to be empty
    console.log('All messages have been sent');
  } catch (error) {
    console.error('Error reading data file or sending messages:', error);
  }
}

// Function to fetch and store all Dapps in S3
export async function fetchAndStoreAllDapps() {
  try {
    const response = await fetchGraphQLRegisteredDapps();
    if (response && response.data.dappRegistereds) {
      const dapps = response.data.dappRegistereds;
      await writeFileToS3(DAPPS_FILE_KEY, JSON.stringify(dapps, null, 2));
      console.log('All Dapps have been fetched and stored in S3');
    }
  } catch (error) {
    console.error('Error fetching and storing Dapps:', error);
  }
}

// Function to check for new Dapps and send alerts
export async function checkNewDappsAndAlert() {
  try {
    const fileContent = await readFileFromS3(DAPPS_FILE_KEY);
    const storedDapps = JSON.parse(fileContent);
    const storedDappIds = new Set(storedDapps.map((dapp: { id: string }) => dapp.id.toLowerCase()));
    console.log("storedDapp", Array.from(storedDapps));

    const response = await fetchGraphQLRegisteredDapps();
    if (response && response.data.dappRegistereds) {
      console.log("response.data.dappRegistereds", Array.from(response.data.dappRegistereds));
      const newDapps = response.data.dappRegistereds.filter((dapp: { id: string }) => {
        const isNew = !storedDappIds.has(dapp.id.toLowerCase());
        if (isNew) {
          console.log(`New Dapp found: ${dapp.id}`);
        }
        return isNew;
      });

      if (newDapps.length > 0) {
        // Send alerts only for new Dapps
        for (const dapp of newDapps) {
          await sendMessagesToAllIds(`New Dapp registered: ${dapp.id}`);
        }

        // Update the stored Dapps file
        const updatedDapps = [...storedDapps, ...newDapps];
        await writeFileToS3(DAPPS_FILE_KEY, JSON.stringify(updatedDapps, null, 2));

        console.log(`Processed ${newDapps.length} new Dapps`);
      } else {
        console.log('No new Dapps found');
      }
    }
  } catch (error) {
    console.error('Error checking for new Dapps:', error);
  }
}

// Function to fetch and store all Dapps in the database
export async function fetchAndStoreAllDappsInDB() {
  try {
    const response = await fetchGraphQLRegisteredDapps();
    if (response && response.data.dappRegistereds) {
      const dapps = response.data.dappRegistereds;

      for (const dapp of dapps) {
        // Check if the dapp already exists in the database
        const existingDapps = await getAllApps();
        const existingDapp = existingDapps.find((existing: { dapp_id: string; }) => existing.dapp_id === dapp.id);

        if (!existingDapp) {
          // Insert the new dapp into the database
          await addApp(dapp.name, dapp.image, dapp.id, DEFAULT_PLATFORM, dapp.url, dapp.description);
          console.log(`New Dapp added: ${dapp.id}`);
        }
      }

      console.log('All Dapps have been fetched and stored in the database');
    }
  } catch (error) {
    console.error('Error fetching and storing Dapps in the database:', error);
  }
}

export async function checkNewDappsAndPopulateDB() {
  try {
    const storedDapps = await getAllApps();
    const storedDappIds = new Set(storedDapps.map((dapp: { dapp_id: string }) => dapp.dapp_id.toLowerCase()));
    console.log("storedDapp", Array.from(storedDapps));

    const response = await fetchGraphQLRegisteredDapps();
    if (response && response.data.dappRegistereds) {
      console.log("response.data.dappRegistereds", Array.from(response.data.dappRegistereds));
      const newDapps = response.data.dappRegistereds.filter((dapp: { id: string }) => {
        const isNew = !storedDappIds.has(dapp.id.toLowerCase());
        if (isNew) {
          console.log(`New Dapp found: ${dapp.id}`);
        }
        return isNew;
      });

      if (newDapps.length > 0) {
        // Insert new Dapps into the database
        for (const dapp of newDapps) {
          await addApp(dapp.name, dapp.image, dapp.id, DEFAULT_PLATFORM, dapp.url, dapp.description);
        }

        console.log(`Processed ${newDapps.length} new Dapps`);
      } else {
        console.log('No new Dapps found');
      }
    }
  } catch (error) {
    console.error('Error checking for new Dapps and populating the database:', error);
  }
}

// Function to periodically check for new Dapps
function startPeriodicCheck() {
  setInterval(checkNewDappsAndAlert, 3600000); // Check every 1 hour
}

// Initial fetch and store of all Dapps
fetchAndStoreAllDapps().then(() => {
  startPeriodicCheck();
});

// // Example usage
// export async function exampleUsage() {
//   const message = 'This is a programmatic Direct Cast';
//   await sendMessagesToAllIds(message);
// }