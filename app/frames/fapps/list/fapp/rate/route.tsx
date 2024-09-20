/* eslint-disable react/jsx-key */
import { frames } from "../../../../frames";
import { Button } from "frames.js/next";

export const POST = frames(async (ctx) => {
    const appname = ctx.searchParams.appname || '';
    const dappId = ctx.searchParams.dappId || '';
    const showLowStars = ctx.searchParams.showLowStars === 'true';

    const post_url = '/';
    const baseUrl = '/fapps/list/rate';
    console.log("Rate :" + appname);

    const mainButtons = [
        <Button action="tx" post_url={post_url} target={{ pathname: baseUrl, query: { appname: appname, dappId: dappId, stars: 5 } }}>
            {'5 stars'}
        </Button>,
        <Button action='tx' post_url={post_url} target={{ pathname: baseUrl, query: { appname: appname, dappId: dappId, stars: 4 } }}>
            {'4 stars'}
        </Button>,
        <Button action='tx' post_url={post_url} target={{ pathname: baseUrl, query: { appname: appname, dappId: dappId, stars: 3 } }}>
            {'3 stars'}
        </Button>,
    ];

    const lowStarButtons = [
        <Button action='tx' post_url={post_url} target={{ pathname: baseUrl, query: { appname: appname, dappId: dappId, stars: 2 } }}>
            {'2 stars'}
        </Button>,
        <Button action='tx' post_url={post_url} target={{ pathname: baseUrl, query: { appname: appname, dappId: dappId, stars: 1 } }}>
            {'1 star'}
        </Button>,
        <Button action="post" target={{ pathname: '/fapps/list/fapp/rate', query: { appname: appname, dappId: dappId } }}>
            {'Back'}
        </Button>,
    ];

    return {
        image: (
            <div style={{ width: '100%', color: 'white', backgroundColor: '#7e5bc2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 48, marginBottom: '20px', flexWrap: 'wrap' }}>
                    <h1 style={{ color: '#FFD700', marginRight: '10px' }}>{`Rate ${appname}`}</h1>
                </div>
                <hr style={{ width: '80%', borderColor: '#7e5bc2', marginBottom: '20px' }} />
                <h2 style={{ color: '#ADD8E6', fontSize: 48, textAlign: 'center' }}>
                    {showLowStars ? 'Choose 1 or 2 stars' : 'Cast Your Vote. Let us know what to improve!'}
                </h2>
            </div>
        ),
        
        buttons: showLowStars ? lowStarButtons : [
            ...mainButtons,
            <Button action="post" target={{ pathname: '/fapps/list/fapp/rate', query: { appname: appname, dappId: dappId, showLowStars: 'true' } }}>
                {'1-2 stars'}
            </Button>,
        ],
        textInput: "Comment!",
    };
});