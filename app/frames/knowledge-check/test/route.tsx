/* eslint-disable react/jsx-key */
import { frames } from "../../frames";
import { Button } from "frames.js/next";
import { getRandomApps, DappRegistered } from '../../../database/apps'

function parseButtonValue(buttonValue: string | undefined): number {
    // Check if buttonValue is undefined or null
    if (buttonValue === undefined || buttonValue === null) {
        return 0;
    }
  
    // Convert buttonValue to a number
    let numberValue = Number(buttonValue);
  
    // Check if numberValue is NaN or not a finite number
    if (isNaN(numberValue) || !Number.isFinite(numberValue)) {
        return 0; // Return 0 if numberValue is NaN or not finite
    }
  
    return Math.floor(numberValue); // Ensure we return an integer value
  }

let selectedDapps: Map<number, DappRegistered[]> = new Map<number, DappRegistered[]>();

export const POST = frames(async (ctx) => {
    const counter = parseButtonValue(ctx.searchParams.counter);
    let score = parseButtonValue(ctx.searchParams.score);
    const fid = ctx.message?.requesterFid || 0;
    let currentApp; 

    if (!selectedDapps.has(fid) || selectedDapps.get(fid)?.length === 0) {
      const fetchedDapps = await getRandomApps();
      console.log(fetchedDapps);
      if (fetchedDapps) {
        
        // Take the first 5 elements from the shuffled array
        selectedDapps.set(fid, fetchedDapps);
      }
    }
    let _dapps = selectedDapps.get(fid);

    if (_dapps) {
      currentApp = _dapps[counter];
    }
    // const currentApp = counter >= 0
    // ? arrDapps[counter]                // From the beginning if counter is non-negative
    // : arrDapps[arrDapps.length + counter];  // From the end if counter is negative
    // Prepare the next URL
    const nextCounter = counter >= 0 ? counter + 1 : counter - 1;
    const nextUrl = counter < 4 
        ? `/knowledge-check/test`
        : `/knowledge-check/result`;
    if (counter == 4) {
          selectedDapps.set(fid, []);
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
            textAlign: 'center',
            width: '100%'
          }}>
          
            <h1 style={{
              color: '#FFD700', 
              marginBottom: '15px', 
              fontSize: '2em', // Further reduced font size
              fontWeight: 'bold', 
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>Is this Farcaster App?</h1>
          
            <hr style={{
              width: '80%', 
              borderColor: 'rgba(255,255,255,0.5)', 
              marginBottom: '10px',
              opacity: 0.5
            }} />
          
            <h2 style={{
              color: '#4CAF50', 
              marginBottom: '10px', 
              fontSize: '1.5em', // Further reduced font size
              fontWeight: 'bold', 
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>{currentApp?.name}</h2>
          
            <p style={{
              color: '#FFD700',
              fontSize: '1.2em', // Further reduced font size
              maxWidth: '80%',
              lineHeight: '1.6',
              marginTop: '10px'
            }}>{`Score: ${score}`}</p>
          
            {/* Progress Bar */}
            <div style={{
              width: '80%',
              backgroundColor: 'rgba(255,255,255,0.5)',
              height: '4px',
              borderRadius: '2px',
              marginTop: '10px',
              display: 'flex'
            }}>
              <div style={{
                width: `${(counter / 5) * 100}%`,
                backgroundColor: '#FFD700',
                height: '4px',
                borderRadius: '2px',
                transition: 'width 0.5s ease-in-out',
                display: 'flex'
              }} />
            </div>
          </div>
    ),
    buttons: [
      <Button action="post" target={{ pathname: nextUrl, query: { counter: nextCounter, score: score + 20 } }} >
        Yes
      </Button>,
      <Button action="post" target={{ pathname: '/fapps/list/fapp/rate', query: { dappId: currentApp?.dapp_id, appname: currentApp?.name }}} >
       Rate App
     </Button>,
       <Button action="post" target={{ pathname: nextUrl, query: { counter: nextCounter, score: Math.max(score - 20, 0) } }} >
       No
     </Button>
    ],
  };
});