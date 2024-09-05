/* eslint-disable react/jsx-key */
import { frames } from "../frames";
import { Button } from "frames.js/next";

export const GET = frames(async (ctx) => {
    const baseUrl = '/fapps/list';
  return {
    image: (
        <div style={{ color: 'white', width: '100%',backgroundColor: '#7e5bc2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', height: '100vh' }}>
        
        <div style={{ display: 'flex', textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: '#FFD700', fontSize: 64 }}>
            Explore Farcaster Ecosystem
          </h1>
        </div>
        <div style={{ display: 'flex', height: '40px' }}></div> {/* Spacer */}
        <div style={{ display: 'flex', textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: 48 }}>
            Start Here & Explore Fapps
          </h2>
        </div>
      </div>
    ),
    buttons: [
      <Button action="post" target={{ pathname: baseUrl, query: { option: 'top' } }} >
        Top
      </Button>,
      <Button action="post" target={{ pathname: baseUrl, query: { option: 'new' } }} >
      New
    </Button>,
    <Button action="post" target={{ pathname: baseUrl, query: { option: 'random' } }} >
    Random
  </Button>
    ],
  };
});

