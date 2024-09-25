/* eslint-disable react/jsx-key */
import { addScore, getUserTotalScoreAndLeaderboardPosition } from "../../../database/scores";
import { frames } from "../../frames";
import { Button } from "frames.js/next";

interface ScoreDescription {
    score: number;
    description: string;
    farcasterRole: string;
    buttonText: string;
    target: string;
}

const scoringSystem: ScoreDescription[] = [
    {
        score: 100,
        description: "Woo, You're an Expert Today!",
        farcasterRole: "Comeback Tomorrow for More!",
        buttonText: "Leaderboard",
        target: "https://www.ratecaster.xyz/leaderboard"
    },
    {
        score: 80,
        description: "Almost Pro, almost..",
        farcasterRole: "",
        buttonText: "Try Again",
        target: "/"
    },
    {
        score: 60,
        description: "Not Bad, Not Good",
        farcasterRole: "",
        buttonText: "Try Again",
        target: "/"
    },
    {
        score: 40,
        description: "You're Getting There, Kinda..",
        farcasterRole: "",
        buttonText: "Try Again",
        target: "/"
    },
    {
        score: 20,
        description: "You Tried, Badly",
        farcasterRole: "",
        buttonText: "Try Again",
        target: "/"
    },
    {
        score: 0,
        description: "Are You Even Trying?",
        farcasterRole: "",
        buttonText: "Try Again",
        target: "/"
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

    if (ctx.message?.requesterFid) {
        await addScore(ctx.message?.requesterFid, score);
    }

    const fid = ctx.message?.requesterFid || 0;
    const result = getScoreDescription(score);
    let first_button_name = result.buttonText;
    let first_button_target = result.target;
    console.log("fid", fid);

    // Get user's total score and leaderboard position
    const { leaderboardPosition } = await getUserTotalScoreAndLeaderboardPosition(fid);

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

                {/* <div style={{
                    color: '#FFD700', // Using gold for rating to stand out
                    fontSize: '3em', // Larger size for emphasis
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    display: 'flex',
                }}>
                    {totalScore}
                </div> */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px'
                }}>
                    <div style={{
                        color: '#FFD700', 
                        fontSize: '3em', 
                        fontWeight: 'bold',
                        textShadow: '1px 1px 2px #000',
                        display: 'flex',
            }}>
                {score}
            </div>
            <div style={{
                color: '#FFD700', 
                fontSize: '1em', 
                fontWeight: 'normal',
                textShadow: '1px 1px 2px #000',
                marginTop: '-10px',
                display: 'flex',
            }}>
                Today&apos;s Rating
            </div>
        </div>              
                <div style={{
                    color: '#ADD8E6',
                    fontSize: '1.3em',
                    fontWeight: 'normal',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    display: 'flex',
                }}>
                    {`Leaderboard Place: ${leaderboardPosition}`}
                </div>
            </div>
        ),
        buttons: [
            <Button 
                action={score === 100 ? "link" : "post"} 
                target={score === 100 ? first_button_target : { pathname: first_button_target, query: { fid: fid } }}
            >
                {first_button_name}
            </Button>,
            <Button action="link" target="https://www.ratecaster.xyz" >
                Add Your App
            </Button>,
        ],
    };
});