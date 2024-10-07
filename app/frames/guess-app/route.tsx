import { frames } from "../frames";
import { Button } from "frames.js/next";
import { getCurrentDailyApp } from '../../../scripts/F-alerts/dailyApp';

function parseButtonValue(buttonValue: string | undefined): number {
    if (buttonValue === undefined || buttonValue === null) {
        return 0;
    }
    let numberValue = Number(buttonValue);
    if (isNaN(numberValue) || !Number.isFinite(numberValue)) {
        return 0;
    }
    return Math.floor(numberValue);
}

export const POST = frames(async (ctx) => {
    const currentDailyApp = getCurrentDailyApp();
    console.log('Current daily app:', currentDailyApp);
    if (!currentDailyApp) {
        return {
            image: <div style={{ width: '1200px', height: '628px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#7e5bc2', color: 'white' }}>No daily app available</div>,
            buttons: [
                <Button key="refresh-button" action="post">Refresh</Button>
            ]
        };
    }

    const attempts = parseButtonValue(ctx.searchParams.attempts);
    const userGuess = ctx.message?.inputText?.toLowerCase();
    const correctAppName = currentDailyApp.name.toLowerCase();

    let buttonLabel = 'Submit';
    let showImage = attempts >= 2;
    let isCorrect = false;
    let showTryAgain = false;
    let currentScore = Math.round(100 / attempts);

    if (userGuess) {
        console.log('User guess:', userGuess);
        console.log('Correct app name:', correctAppName);
        isCorrect = userGuess === correctAppName;
        showTryAgain = !isCorrect;
    } else if (userGuess == ''){
        isCorrect = false;
        showTryAgain = true;
    }

    if (isCorrect) {
        return {
            image: (
                <div style={{ width: '1200px', height: '628px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#7e5bc2', color: '#FFD700', fontSize: '64px', fontWeight: 'bold' }}>
                    Correct! You Are Right!
                </div>
            ),
            buttons: [
                <Button key="result-button" action="post" target={{ pathname: '/guess-app/leaderboard', query: { score: currentScore, dappId: currentDailyApp.dapp_id, appname: currentDailyApp.name }  }}>
                    See Results
                </Button>
            ]
        };
    } else if (!isCorrect && attempts == 3) {
        return {
            image: (
                <div style={{ width: '1200px', height: '628px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#7e5bc2', color: '#FFD700', fontSize: '64px', fontWeight: 'bold' }}>
                    Not This Time
                </div>
            ),
            buttons: [
                <Button key="result-button" action="post" target={{ pathname: '/guess-app/leaderboard', query: { score: currentScore, dappId: currentDailyApp.dapp_id, appname: currentDailyApp.name }  }}>
                    See Results
                </Button>
            ]
        };
    }

    return {
        image: (
            <div style={{
                color: 'white',
                backgroundColor: '#7e5bc2',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '1200px',
                height: '628px',
                padding: '20px',
                position: 'relative',
              }}>
                <h1 style={{
                  color: '#FFD700', 
                  fontSize: '64px',
                  fontWeight: 'bold', 
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  textAlign: 'center',
                  marginBottom: '40px',
                  marginLeft: '43%',
                  width: '100%',
                }}>Guess Farcaster App!</h1>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                  flex: 1,
                }}>
                  <div style={{
                    flex: 1,
                    maxWidth: '45%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRight: '2px solid #FFD700',
                    paddingRight: '20px',
                  }}>
                    
                    {showImage && currentDailyApp.image ? (
                      <img 
                        src={currentDailyApp.image} 
                        width={250} 
                        height={250} 
                        alt={currentDailyApp.name}
                        style={{
                          objectFit: 'contain',
                          maxWidth: '100%',
                          maxHeight: '100%'
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.parentElement) {
                            e.currentTarget.parentElement.textContent = 'Image not available';
                          }
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '250px',
                        height: '250px',
                        backgroundColor: '#7e5bc2',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '10px',
                        color: '#FFD700',
                        fontSize: '48px'
                      }}>
                        {showTryAgain ? 'Try Again ->' : 'Use Hints ->'}
                      </div>
                    )}
                  </div>
                  <div style={{
                    flex: 1,
                    maxWidth: '45%',
                    paddingLeft: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                    <h2 style={{
                      color: '#FFD700',
                      fontSize: '48px',
                      marginBottom: '20px'
                    }}>Hints</h2>
                    <p style={{
                      color: '#FFFFFF',
                      fontSize: '32px',
                      lineHeight: 1.6,
                      marginBottom: '15px'
                    }}>
                      Description: {currentDailyApp.description || ''}
                    </p>
                    {attempts >= 1 && (
                      <p style={{
                        color: '#FFFFFF',
                        fontSize: '32px',
                        lineHeight: 1.6,
                        marginBottom: '15px'
                      }}>
                        Rating: {currentDailyApp.averageRating 
                          ? currentDailyApp.averageRating.toFixed(2) 
                          : 'None. Be the first to Rate!'}
                      </p>
                    )}
                  </div>
                </div>
            </div>
        ),
        buttons: [
          <Button 
            key='guess-button'
            action="post" 
            target={{ 
              pathname: '/guess-app', 
              query: { 
                attempts: attempts + 1
              } 
            }} 
          >
            {buttonLabel}
          </Button>
        ],
        textInput: "Enter your guess",
    };
});

export const GET = POST;