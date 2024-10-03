/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";
import { appURL } from "../utils";

const frameHandler = frames(async (ctx) => {
  // Randomly assign the counter to 0 or -0
  let initialCounter = Math.random() < 0.5 ? 0 : -0;
  let actionUrl = `/knowledge-check/test`;
  return {
    image: (
      <div style={{
        color: 'white',
        backgroundColor: '#7e5bc2',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        minHeight: '100vh',
        width: '100%'
      }}>
	<div style={{
          display: 'flex', // Added display flex here
          flexDirection: 'column', // Added to stack children vertically
          alignItems: 'center', // Center children horizontally
          justifyContent: 'center', // Center children vertically
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <h1 style={{
            color: '#FFD700',
            marginBottom: '15px',
            fontSize: '2em', // Further reduced font size
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>You think you know Farcaster Apps?</h1>
          <h2 style={{
             color: 'rgba(255,255,255,0.8)',
             fontSize: '1.2em', // Further reduced font size
             maxWidth: '80%',
             lineHeight: '1.6',
             marginTop: '10px'
          }}>Test your knowledge!</h2>

        </div>
      </div>
    ),
    buttons: [
      <Button action="post" target={{ pathname: actionUrl, query: { counter: initialCounter, score: 0 } }}>
        Play!
      </Button>,
    ],
    postUrl: 'http://frames.ratecaster.xyz/frames'
  };
});

export const GET = frameHandler;
export const POST = frameHandler;