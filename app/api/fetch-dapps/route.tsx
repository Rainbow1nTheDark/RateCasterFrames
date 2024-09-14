import { NextRequest, NextResponse } from 'next/server';
import { checkNewDappsAndAlert } from '../../../scripts/F-alerts/f-alert';

export async function GET(req: NextRequest) {
  try {
    await checkNewDappsAndAlert();
    return NextResponse.json({ message: 'Dapps fetched and stored successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error fetching and storing Dapps:', error);
    return NextResponse.json({ message: 'Error fetching and storing Dapps' }, { status: 500 });
  }
}



