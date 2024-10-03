import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable logging for debugging
});

export interface DappRegistered {
  id: number; // Changed from string to number
  name: string;
  image: string | null;
  dapp_id: string;
  platform: string;
  url: string;
  description: string | null;
}

// Function to add a new app
export async function addApp(
  name: string,
  image: string | null,
  dapp_id: string,
  platform: string,
  url: string,
  description: string | null
): Promise<DappRegistered> {
  try {
    const app = await prisma.apps.create({
      data: {
        name,
        image,
        dapp_id,
        platform,
        url,
        description,
      },
    });
    return app;
  } catch (error) {
    throw new Error('App creation failed');
  }
}

// Function to get all apps
export async function getAllApps(): Promise<DappRegistered[]> {
  try {
    const apps = await prisma.apps.findMany();
    console.log(apps);
    return apps;
  } catch (error) {
    throw new Error('Failed to fetch apps');
  }
}

// Function to get 5 random apps
export async function getRandomApps(): Promise<DappRegistered[]> {
  try {
    const apps = await prisma.$queryRaw<DappRegistered[]>`SELECT * FROM apps ORDER BY RANDOM() LIMIT 5`;
    
    return apps;
  } catch (error) {
    throw new Error('Failed to fetch random apps');
  }
}

export async function getRandomApp(): Promise<DappRegistered | undefined> {
  try {
    const apps = await prisma.$queryRaw<DappRegistered[]>`SELECT * FROM apps WHERE platform = 'farcaster' and image != '' ORDER BY RANDOM() LIMIT 1`;
    
    if (apps.length === 0) {
      throw new Error('No apps found');
    }
    
    return apps[0]; // Return the first (and only) app in the array
  } catch (error) {
    throw new Error('Failed to fetch random app');
  }
}