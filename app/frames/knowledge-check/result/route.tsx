/* eslint-disable react/jsx-key */
import { frames } from "../../frames";
import { Button } from "frames.js/next";

interface ScoreDescription {
    score: number;
    description: string;
    farcasterRole: string;
    buttonText: string;
  }
  
  const scoringSystem: ScoreDescription[] = [
    {
      score: 100,
      description: "Woo, You're an Expert!",
      farcasterRole: "Set Alert: Don't miss any new Fapps!",
      buttonText: "Lead Now"
    },
    {
      score: 80,
      description: "Almost Pro",
      farcasterRole: "Set Alert: Stay ahead with new Fapps.",
      buttonText: "Shape Now"
    },
    {
      score: 60,
      description: "Not Bad, Prob",
      farcasterRole: "Set Alert: Keep up with Fapp Store trends.",
      buttonText: "Influence"
    },
    {
      score: 40,
      description: "You're Getting There, Kinda..",
      farcasterRole: "Set Alert: Keep up with Fapp Store trends.",
      buttonText: "Explore"
    },
    {
      score: 20,
      description: "You Tried, Badly",
      farcasterRole: "Set Alert: Keep up with Fapp Store trends.",
      buttonText: "Discover"
    },
    {
      score: 0,
      description: "Are You Even Trying?",
      farcasterRole: "Set Alert: Keep up with Fapp Store trends.",
      buttonText: "Start Now"
    }
];
  
  function getScoreDescription(score: number): ScoreDescription {
    const scoreEntry = scoringSystem.find(entry => entry.score === score);
    return scoreEntry ? scoreEntry : getScoreDescription(0);
  }

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
  
export const POST = frames(async (ctx) => {
    let score = parseButtonValue(ctx.searchParams.score);

    // if (frameData){
    //     const { fid } = frameData;
    //     updateScore(String(fid), score);
    // }

    const fid = ctx.message?.requesterFid || 0;
    const result = getScoreDescription(score);
    console.log("fid", fid);
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
        width: '100%',
        }}>
        <h1 style={{
            color: '#FFD700', 
            marginBottom: '15px', 
            fontSize: '2em', 
            fontWeight: 'bold', 
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>{result.description}</h1>

        <hr style={{
            width: '80%', 
            borderColor: 'rgba(255,255,255,0.5)', 
            marginBottom: '10px',
            opacity: 0.5
        }} />

        <div style={{
            color: '#ADD8E6', 
            fontSize: '1.3em', // Further reduced from 1.5em
            fontWeight: 'normal',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginTop: '10px'
        }}>
            {result.farcasterRole}
        </div>
        </div>
    ),
    buttons: [
      <Button action="post" target={{ pathname: '/alert', query: { fid: fid}}} >
        Set Alert!
      </Button>,
      <Button action="link" target="https://www.ratecaster.xyz" >
        Add Your Fapp
      </Button>,
      
    ],
  };
});