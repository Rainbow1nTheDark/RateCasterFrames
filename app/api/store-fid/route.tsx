import { NextResponse } from 'next/server';
import { readFileFromS3, writeFileToS3 } from '../../../scripts/aws/s3Utils';

const DATA_FILE_KEY = 'farcaster-ids.json';

interface FarcasterData {
  [fid: string]: { lastUpdated: string };
}

export async function POST(request: Request) {
  try {
    const { fid } = await request.json();

    if (!fid) {
      return NextResponse.json({ error: 'Farcaster ID is required' }, { status: 400 });
    }

    // Read existing data from S3 or use initial data
    let data: FarcasterData;
    try {
      const fileContent = await readFileFromS3(DATA_FILE_KEY);
      data = JSON.parse(fileContent);
    } catch (error) {
      console.log('Using initial data or creating new file.');
      data = {};
    }

    // Add or update the Farcaster ID
    data[fid] = { lastUpdated: new Date().toISOString() };

    // Write updated data back to S3
    await writeFileToS3(DATA_FILE_KEY, JSON.stringify(data, null, 2));

    console.log('Data written to S3:', data);

    return NextResponse.json({ success: true, message: 'Farcaster ID stored successfully' });
  } catch (error) {
    console.error('Error storing Farcaster ID:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to store Farcaster ID', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Failed to store Farcaster ID', details: 'An unknown error occurred' }, { status: 500 });
    }
  }
}