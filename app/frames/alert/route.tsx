/* eslint-disable react/jsx-key */
import { frames } from "../frames";
import { Button } from "frames.js/next";

export const POST = frames(async (ctx) => {
  const fid = ctx.message?.requesterFid;
  console.log("fid", fid);
  let storageSuccess = false;
  let errorMessage = '';

  if (fid) {
    try {
      const response = await fetch(`${process.env.APP_URL}/api/store-fid?fid=${fid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fid, username: `user_${fid}` }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      storageSuccess = true;
    } catch (error) {
      console.error('Error storing Farcaster ID:', error);
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = 'An unknown error occurred';
      }
    }
  }

  return {
    image: (
      <div style={{
        color: 'white',
        backgroundColor: '#7e5bc2',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        height: '100%',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: '#FFD700',
          marginBottom: '15px',
          fontSize: '2em',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          {storageSuccess ? 'Farcaster ID Stored!' : 'Error Storing Farcaster ID'}
        </h1>

        <div style={{
          color: '#ADD8E6',
          fontSize: '1.3em',
          fontWeight: 'normal',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginTop: '10px'
        }}>
          {storageSuccess 
            ? 'Your Farcaster ID has been successfully stored.'
            : `There was an error storing your Farcaster ID: ${errorMessage}`}
        </div>
      </div>
    ),
    buttons: [
      <Button action="post" target={{ pathname: storageSuccess ? '/knowledge-check/test' : '/alert' }}>
        {storageSuccess ? 'Start Quiz' : 'Try Again'}
      </Button>,
    ],
  };
});