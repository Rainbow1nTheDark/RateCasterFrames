import { frames,  } from "../../frames";
import { Button } from "frames.js/next";
import { addScore, getTopLeaders, getUserTotalScoreAndLeaderboardPosition } from "../../../database/scores";

async function getUsername(fid: number): Promise<string> {
    try {
        const response = await fetch(`https://api.warpcast.com/v2/user?fid=${fid}`);
        const data = await response.json();
        return data.result.user.username;
    } catch (error) {
        console.error(`Error fetching username for FID ${fid}:`, error);
        return `User ${fid}`;
    }
}

export const POST = frames(async (ctx) => {
    const fid = ctx.message?.requesterFid || 0;
    const score = parseInt(ctx.searchParams.score as string) || 0;
    // Add the score to the database
    console.log("fid", fid);
    await addScore(fid, score);
    const topLeaders = await getTopLeaders(2);
    const { totalScore, leaderboardPosition } = await getUserTotalScoreAndLeaderboardPosition(fid);

    // Fetch usernames for top leaders and current user
    const topLeadersWithUsernames = await Promise.all(topLeaders.map(async (leader) => ({
        ...leader,
        username: await getUsername(leader.fid)
    })));
    const currentUsername = await getUsername(fid);

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
                    marginBottom: '30px',
                    fontSize: '2.0em',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}>🏆 Leaderboard 🏆</h1>

                {topLeadersWithUsernames.map((leader, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '80%',
                        marginBottom: '15px',
                        fontSize: '1.2em',
                        color: index === 0 ? '#FFD700' : 'white',
                    }}>
                        <span>{index + 1}. {leader.username}</span>
                        <span>{leader.totalScore}</span>
                    </div>
                ))}

                <div style={{
                    fontSize: '2em',
                    marginTop: '10px',
                    marginBottom: '10px',
                    display: 'flex'
                }}>...</div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '80%',
                    marginTop: '15px',
                    fontSize: '1.2em',
                    color: '#ADD8E6',
                }}>
                    <span>{leaderboardPosition}. {currentUsername}</span>
                    <span>{totalScore}</span>
                </div>

                <div style={{
                    marginTop: '30px',
                    fontSize: '1.3em',
                    fontWeight: 'bold',
                    color: '#FFD700',
                    display: 'flex'
                }}>
                    Your Position: {leaderboardPosition}
                </div>
            </div>
        ),
        buttons: [
            <Button key="back-home" action="post" target="/guess-app">
                Back to Home
            </Button>,
            <Button key="full-leaderboard" action="link" target="https://www.ratecaster.xyz/leaderboard">
                Full Leaderboard
            </Button>,
        ],
    };
});

export const GET = POST;